import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

import { ICON_SIZES, PADDINGS, RADII } from './constants.js';

export default class DashIconSizePreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        window._settings = this.getSettings();

        const page = new Adw.PreferencesPage({
            title: 'Dash Icon Size',
            icon_name: 'dialog-information-symbolic',
        });
        window.add(page);

        const group = new Adw.PreferencesGroup();
        page.add(group);

        // Icon size
        const adjustmentIconSize = new Gtk.Adjustment({
            lower: ICON_SIZES[0],
            upper: ICON_SIZES[ICON_SIZES.length - 1],
            step_increment: 2,
        });

        const iconSizeRow = new Adw.SpinRow({
            title: 'Icon size (px)',
            subtitle: `Size of the dash icons. Available: ${ICON_SIZES.join(', ')}px`,
            adjustment: adjustmentIconSize,
        });
        group.add(iconSizeRow);
        window._settings.bind('icon-size', iconSizeRow, 'value', Gio.SettingsBindFlags.DEFAULT);

        // Padding
        const adjustmentPadding = new Gtk.Adjustment({
            lower: PADDINGS[0],
            upper: PADDINGS[PADDINGS.length - 1],
            step_increment: 2,
        });

        const paddingRow = new Adw.SpinRow({
            title: 'Dash padding (px)',
            subtitle: `Padding around the dash. Available: ${PADDINGS.join(', ')}px`,
            adjustment: adjustmentPadding,
        });
        group.add(paddingRow);
        window._settings.bind('dash-padding', paddingRow, 'value', Gio.SettingsBindFlags.DEFAULT);

        // Border radius
        const adjustmentRadius = new Gtk.Adjustment({
            lower: RADII[0],
            upper: RADII[RADII.length - 1],
            step_increment: 2,
        });

        const radiusRow = new Adw.SpinRow({
            title: 'Dash border radius (px)',
            subtitle: `Border radius of the dash background. Available: ${RADII.join(', ')}px`,
            adjustment: adjustmentRadius,
        });
        group.add(radiusRow);
        window._settings.bind('dash-radius', radiusRow, 'value', Gio.SettingsBindFlags.DEFAULT);
    }
}
