package dk.xpressbudet.xpressintra;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

@CapacitorPlugin(name = "UpdateInstaller")
public class UpdateInstallerPlugin extends Plugin {
    private static final String GITHUB_RELEASE_HOST = "github.com";

    @PluginMethod
    public void install(PluginCall call) {
        String apkUrl = call.getString("url", "");
        if (!isAllowedApkUrl(apkUrl)) {
            call.reject("Downloadlinket er ikke godkendt.");
            return;
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && !getContext().getPackageManager().canRequestPackageInstalls()) {
            openUnknownAppsSettings();
            JSObject result = new JSObject();
            result.put("needsPermission", true);
            result.put("message", "Tillad installation fra XpressIntra og tryk Opdater igen.");
            call.resolve(result);
            return;
        }

        getBridge().execute(() -> {
            try {
                File apkFile = downloadApk(apkUrl);
                openInstaller(apkFile);
                JSObject result = new JSObject();
                result.put("started", true);
                call.resolve(result);
            } catch (Exception exception) {
                call.reject("Kunne ikke hente eller starte opdateringen: " + exception.getMessage(), exception);
            }
        });
    }

    @PluginMethod
    public void openInstallSettings(PluginCall call) {
        openUnknownAppsSettings();
        call.resolve();
    }

    private boolean isAllowedApkUrl(String value) {
        if (value == null || value.trim().isEmpty()) return false;
        try {
            Uri uri = Uri.parse(value);
            String host = uri.getHost();
            String path = uri.getPath();
            return "https".equalsIgnoreCase(uri.getScheme())
                && GITHUB_RELEASE_HOST.equalsIgnoreCase(host)
                && path != null
                && path.startsWith("/stralner2711-a11y/xpresshub/releases/download/")
                && path.endsWith(".apk");
        } catch (Exception ignored) {
            return false;
        }
    }

    private File downloadApk(String apkUrl) throws Exception {
        URL url = new URL(apkUrl);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setConnectTimeout(15000);
        connection.setReadTimeout(60000);
        connection.setInstanceFollowRedirects(true);
        connection.connect();

        int status = connection.getResponseCode();
        if (status < 200 || status >= 300) {
            throw new IllegalStateException("GitHub svarede " + status);
        }

        File dir = new File(getContext().getCacheDir(), "updates");
        if (!dir.exists() && !dir.mkdirs()) {
            throw new IllegalStateException("Kunne ikke oprette update-mappe.");
        }

        File apkFile = new File(dir, "xpressintra-update.apk");
        try (InputStream input = connection.getInputStream(); FileOutputStream output = new FileOutputStream(apkFile, false)) {
            byte[] buffer = new byte[8192];
            int read;
            while ((read = input.read(buffer)) != -1) {
                output.write(buffer, 0, read);
            }
        } finally {
            connection.disconnect();
        }

        return apkFile;
    }

    private void openInstaller(File apkFile) {
        Uri apkUri = FileProvider.getUriForFile(
            getContext(),
            getContext().getPackageName() + ".fileprovider",
            apkFile
        );

        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        getActivity().startActivity(intent);
    }

    private void openUnknownAppsSettings() {
        Intent intent;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            intent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
            intent.setData(Uri.parse("package:" + getContext().getPackageName()));
        } else {
            intent = new Intent(Settings.ACTION_SECURITY_SETTINGS);
        }
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getActivity().startActivity(intent);
    }
}
