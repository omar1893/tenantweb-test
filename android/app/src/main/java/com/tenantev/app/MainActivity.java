package com.tenantev.app;

import com.getcapacitor.BridgeActivity;
import android.os.Bundle;
import com.getcapacitor.Plugin;
import java.util.ArrayList;
import co.boundstate.BranchDeepLinks;
import android.content.Intent;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Forzar nueva sesión de Branch si el intent viene de un deep link
        Intent intent = getIntent();
        if (intent != null && intent.getData() != null) {
            intent.putExtra("branch_force_new_session", true);
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        // Forzar nueva sesión de Branch si el intent viene de un deep link
        if (intent != null && intent.getData() != null) {
            intent.putExtra("branch_force_new_session", true);
        }
    }
}
