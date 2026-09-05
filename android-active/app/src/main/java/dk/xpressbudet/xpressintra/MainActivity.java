package dk.xpressbudet.xpressintra;

import android.Manifest;
import android.os.Bundle;
import android.os.Build;
import android.content.pm.PackageManager;
import android.view.View;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final int NOTIFICATION_PERMISSION_REQUEST = 1201;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(UpdateInstallerPlugin.class);
        super.onCreate(savedInstanceState);
        // Keep the WebView's controls above Android's navigation and status bars.
        View content = findViewById(android.R.id.content);
        ViewCompat.setOnApplyWindowInsetsListener(content, (view, windowInsets) -> {
            Insets bars = windowInsets.getInsets(
                WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout()
            );
            view.setPadding(bars.left, bars.top, bars.right, bars.bottom);
            return windowInsets;
        });
        ViewCompat.requestApplyInsets(content);
        requestNotificationPermissionOnFirstStart();
    }

    private void requestNotificationPermissionOnFirstStart() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) return;
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED) return;
        ActivityCompat.requestPermissions(
            this,
            new String[] { Manifest.permission.POST_NOTIFICATIONS },
            NOTIFICATION_PERMISSION_REQUEST
        );
    }
}
