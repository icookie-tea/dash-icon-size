/*
    Dash Icon Size - GNOME Shell 46+ extension
    Copyright @icookie 2025 - License GPL v3
*/

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';


const ICON_SIZES = [24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80];
const PADDINGS = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32];
const RADII = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32];

const DashStyle = class {
    constructor(settings) {
        this._settings = settings;
        this._uiGroup = Main.layoutManager.uiGroup;
        this._settingsId = null;

        this._applySettings();
    }

    _applySettings() {
        // Remove old classes
        ICON_SIZES.forEach(size => {
            this._uiGroup.remove_style_class_name(`dash-icon-size-icon${size}`);
        });
        PADDINGS.forEach(padding => {
            this._uiGroup.remove_style_class_name(`dash-icon-size-padding${padding}`);
        });
        RADII.forEach(radius => {
            this._uiGroup.remove_style_class_name(`dash-icon-size-radius${radius}`);
        });

        // Add new classes based on settings
        const iconSize = this._settings.get_int('icon-size');
        const padding = this._settings.get_int('dash-padding');
        const radius = this._settings.get_int('dash-radius');

        // Find nearest valid size
        const validSize = ICON_SIZES.reduce((prev, curr) =>
            Math.abs(curr - iconSize) < Math.abs(prev - iconSize) ? curr : prev
        );

        // Find nearest valid padding
        const validPadding = PADDINGS.reduce((prev, curr) =>
            Math.abs(curr - padding) < Math.abs(prev - padding) ? curr : prev
        );

        // Find nearest valid radius
        const validRadius = RADII.reduce((prev, curr) =>
            Math.abs(curr - radius) < Math.abs(prev - radius) ? curr : prev
        );

        this._uiGroup.add_style_class_name(`dash-icon-size-icon${validSize}`);
        this._uiGroup.add_style_class_name(`dash-icon-size-padding${validPadding}`);
        this._uiGroup.add_style_class_name(`dash-icon-size-radius${validRadius}`);
    }

    enable() {
        this._settingsId = this._settings.connect('changed', () => this._applySettings());
    }

    destroy() {
        if (this._settingsId) {
            this._settings.disconnect(this._settingsId);
            this._settingsId = null;
        }

        // Remove all classes
        ICON_SIZES.forEach(size => {
            this._uiGroup.remove_style_class_name(`dash-icon-size-icon${size}`);
        });
        PADDINGS.forEach(padding => {
            this._uiGroup.remove_style_class_name(`dash-icon-size-padding${padding}`);
        });
        RADII.forEach(radius => {
            this._uiGroup.remove_style_class_name(`dash-icon-size-radius${radius}`);
        });
    }
};

export default class DashIconSizeExtension extends Extension {
    constructor(metadata) {
        super(metadata);
    }

    enable() {
        if (Main.layoutManager._startingUp) {
            this._startupCompleteId = Main.layoutManager.connect('startup-complete', () => {
                this._initDash();
                Main.layoutManager.disconnect(this._startupCompleteId);
                this._startupCompleteId = null;
            });
        } else {
            this._initDash();
        }
    }

    _initDash() {
        this._settings = this.getSettings();
        this._dashStyle = new DashStyle(this._settings);
        this._dashStyle.enable();
    }

    disable() {
        this._dashStyle?.destroy();
        this._dashStyle = null;
        this._settings = null;
        if (this._startupCompleteId) {
            Main.layoutManager.disconnect(this._startupCompleteId);
            this._startupCompleteId = null;
        }
        Main.layoutManager.disconnectObject(this);
    }
}
