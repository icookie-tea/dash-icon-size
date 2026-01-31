/*
    Dash Icon Size - GNOME Shell 46+ extension
    Copyright @icookie 2025 - License GPL v3
*/

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

import { ICON_SIZES, PADDINGS, RADII, STYLE_CLASSES } from './constants.js';

const DashStyle = class {
    constructor(settings) {
        this._settings = settings;
        this._uiGroup = Main.layoutManager.uiGroup;
        this._settingsId = null;

        this._applySettings();
    }

    _clearAllStyleClasses() {
        ICON_SIZES.forEach(size => {
            this._uiGroup.remove_style_class_name(`${STYLE_CLASSES.ICON}${size}`);
        });
        PADDINGS.forEach(padding => {
            this._uiGroup.remove_style_class_name(`${STYLE_CLASSES.PADDING}${padding}`);
        });
        RADII.forEach(radius => {
            this._uiGroup.remove_style_class_name(`${STYLE_CLASSES.RADIUS}${radius}`);
        });
    }

    _findNearestValidValue(value, validValues) {
        return validValues.reduce((prev, curr) =>
            Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
        );
    }

    _applySettings() {
        this._clearAllStyleClasses();

        // Add new classes based on settings
        const iconSize = this._settings.get_int('icon-size');
        const padding = this._settings.get_int('dash-padding');
        const radius = this._settings.get_int('dash-radius');

        const validSize = this._findNearestValidValue(iconSize, ICON_SIZES);
        const validPadding = this._findNearestValidValue(padding, PADDINGS);
        const validRadius = this._findNearestValidValue(radius, RADII);

        this._uiGroup.add_style_class_name(`${STYLE_CLASSES.ICON}${validSize}`);
        this._uiGroup.add_style_class_name(`${STYLE_CLASSES.PADDING}${validPadding}`);
        this._uiGroup.add_style_class_name(`${STYLE_CLASSES.RADIUS}${validRadius}`);
    }

    enable() {
        this._settingsId = this._settings.connect('changed', () => this._applySettings());
    }

    destroy() {
        if (this._settingsId) {
            this._settings.disconnect(this._settingsId);
            this._settingsId = null;
        }

        this._clearAllStyleClasses();
    }
};

export default class DashIconSizeExtension extends Extension {
    constructor(metadata) {
        super(metadata);
    }

    enable() {
        this._initDash();
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
