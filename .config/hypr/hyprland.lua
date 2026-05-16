local tools = require("tools")

local name = tools.get_hostname()
local isRyzenekNew = name == "ryzenek-new"
local isRyzenekOld = name == "ryzenek-old"
local isThinkpad = name == "raketanamars"
local isDesktop = isRyzenekNew or isRyzenekOld

hl.on("hyprland.start", function()
    hl.exec_cmd("dbus-update-activation-environment --systemd --all")
    hl.exec_cmd("systemctl --user import-environment WAYLAND_DISPLAY XDG_CURRENT_DESKTOP QT_QPA_PLATFORMTHEME")
    hl.exec_cmd("/usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1")
    hl.exec_cmd("/usr/lib/pam_kwallet_init")
    hl.exec_cmd("wlsunset -l 49.75 -L 16.47 -t 5000 -d 1800")
    hl.exec_cmd("nm-applet --indicator")
    hl.exec_cmd("swayosd-server")
    -- hl.exec_cmd("udiskie --no-automount --no-notify --tray")
    hl.exec_cmd("thunar --daemon")
    hl.exec_cmd("swaync")
    hl.exec_cmd("vicinae server")
    hl.exec_cmd("hyprpaper")
    if isDesktop then
        hl.exec_cmd("ags run -d ~/.dotfiles/ags")
        hl.timer(function()
            hl.exec_cmd("spotify-launcher")
        end, { timeout = 4000, type = "oneshot" })
        hl.timer(function()
            hl.exec_cmd("env GDK_BACKEND=x11 thunderbird", { workspace = "special silent" })
        end, { timeout = 8000, type = "oneshot" })
    end
    if isRyzenekNew then
        hl.exec_cmd("easyeffects --gapplication-service")
        hl.timer(function()
            hl.dispatch(hl.dsp.cursor.move({ x = 2880, y = 540 }))
        end, { timeout = 300, type = "oneshot" })
        hl.timer(function()
            hl.exec_cmd("solaar --window=hide")
        end, { timeout = 3000, type = "oneshot" })
        hl.timer(function()
            hl.exec_cmd("~/AppImages/openrgb.appimage --startminimized")
        end, { timeout = 7000, type = "oneshot" })
    end
    if isRyzenekOld then
        hl.exec_cmd("~/.autostart")
    end
    if isThinkpad then
        hl.exec_cmd("ags run")
        hl.exec_cmd("~/.autostart")
        hl.exec_cmd("hypridle")
    end
end)

if isRyzenekNew then
    hl.monitor({
        output   = "DP-1",
        mode     = "1920x1080@144",
        position = "1920x0",
        scale    = "1",
        bitdepth = 10,
    })
    hl.monitor({
        output   = "DP-2",
        mode     = "1920x1080@60",
        position = "0x0",
        scale    = "1",
    })
    hl.monitor({
        output   = "HDMI-A-1",
        disabled = true
    })
end
if isRyzenekOld then
    hl.monitor({
        output = "HDMI-A-2",
        mode = "2560x1440@60",
        position = "0x0",
        scale = 1,
    })
    hl.monitor({
        output = "android",
        mode = "2304x1440@60",
        position = "1800x1440",
        scale = 2,
    })
end
if isThinkpad then
    hl.monitor({
        output = "eDP-1",
        mode = "1920x1080@60",
        position = "0x0",
        scale = 1,
	})
end

hl.config({
    input = {
        kb_layout = "cz, cz",
        kb_variant = "coder, qwerty",
        kb_options = "grp:win_space_toggle",
        follow_mouse = true,
        sensitivity = 0,
        accel_profile = "flat",
        numlock_by_default = true,
        touchpad = {
            natural_scroll = true,
            disable_while_typing = false,
        },
    },
    general = {
        gaps_in = 2,
        gaps_out = 4,
        border_size = 2,
        col = {
            active_border = { colors = { "rgba(33ccffee)", "rgba(33ffccee)" }, angle = 45 },
            inactive_border = "rgba(595959aa)"
        },
        layout = "dwindle",
        snap = {
            enabled = true,
            window_gap = 6,
            monitor_gap = 7,
        }
    },
    decoration = {
        rounding = 5,
        blur = {
            enabled = true,
            size = 6,
            passes = 2,
            new_optimizations = true,
            special = true,
        },
        shadow = {
            enabled = false,
        },
    },
    animations = {
        enabled = false,
    },
    dwindle = {
        preserve_split = true,
        smart_split = true,
        special_scale_factor = 0.95,
    },
    xwayland = {
        force_zero_scaling = true,
    },
    misc = {
        disable_hyprland_logo = true,
        close_special_on_empty = true,
        background_color = "0x4A5459",
        initial_workspace_tracking = 0,
        vrr = 3,
    },
    render = {
        direct_scanout = false,
    },
    cursor = {
        no_break_fs_vrr = 2,
        min_refresh_rate = 48,
        enable_hyprcursor = true,
    },
})

if isRyzenekNew then
    hl.config({
        input = {
            sensitivity = -0.5,
        },
    })
end

hl.curve("myBezier", { type = "bezier", points = { { 0.05, 0.9 }, { 0.1, 1.05 } } })
hl.animation({ leaf = "global", enabled = true, speed = 10, bezier = "default" })
hl.animation({ leaf = "windows", enabled = true, speed = 7, bezier = "myBezier" })
hl.animation({ leaf = "windowsOut", enabled = true, speed = 7, bezier = "default", style = "popin 80%" })
hl.animation({ leaf = "border", enabled = true, speed = 10, bezier = "default" })
hl.animation({ leaf = "fade", enabled = true, speed = 7, bezier = "default" })
hl.animation({ leaf = "workspaces", enabled = true, speed = 3, bezier = "default", style = "slidevert" })
hl.animation({ leaf = "specialWorkspace", enabled = true, speed = 6, bezier = "default", style = "slidevert" })

hl.device({
    name = "sony-interactive-entertainment-dualsense-wireless-controller-touchpad",
    enabled = false,
})
hl.device({
    name = "dualsense-wireless-controller-touchpad",
    enabled = false,
})
hl.device({
    name = "tpps/2-elan-trackpoint",
    sensitivity = -0.2,
    accel_profile = "flat",
})

hl.env("HYPRCURSOR_THEME", "Bibata-Modern-Classic")
hl.env("HYPRCURSOR_SIZE", "24")
hl.env("XCURSOR_THEME", "Bibata-Modern-Classic")
hl.env("XCURSOR_SIZE", "24")

hl.env("QT_QPA_PLATFORMTHEME", "kvantum")
hl.env("QT_STYLE_OVERRIDE", "kvantum")
hl.env("GTK_THEME", "Fluent-Dark-compact")
hl.env("XDG_MENU_PREFIX", "arch-")

hl.layer_rule({
    match = {
        namespace = "gtk-layer-shell"
    },
    blur = true,
})
hl.layer_rule({
    match = {
        namespace = "bar",
    },
    blur = true,
})
hl.layer_rule({
    match = {
        namespace = "logout_dialog",
    },
    blur = true,
})
hl.layer_rule({
    match = {
        namespace = "swaync-control-center",
    },
    blur = true,
    ignore_alpha = 0,
})
hl.layer_rule({
    match = {
        namespace = "swaync-notification-window",
    },
    blur = true,
    ignore_alpha = 0,
})
hl.layer_rule({
    match = {
        namespace = "vicinae",
    },
    blur = true,
    ignore_alpha = 0,
})

if isRyzenekNew then
    hl.workspace_rule({
        workspace = "1",
        monitor = "DP-1",
        default = true,
    })
    hl.workspace_rule({
        workspace = "5",
        monitor = "DP-2",
        default = true,
    })
end

-- Smart gaps
hl.workspace_rule({ workspace = "w[tv1]s[false]", gaps_out = 0, gaps_in = 0 })
hl.workspace_rule({ workspace = "f[1]s[false]", gaps_out = 0, gaps_in = 0 })
hl.window_rule({ match = { float = false, workspace = "w[tv1]s[false]" }, border_size = 0 })
hl.window_rule({ match = { float = false, workspace = "w[tv1]s[false]" }, rounding = 0 })
hl.window_rule({ match = { float = false, workspace = "f[1]s[false]" }, border_size = 0 })
hl.window_rule({ match = { float = false, workspace = "f[1]s[false]" }, rounding = 0 })

hl.window_rule({
    match = {
        pin = true,
    },
    border_color = "rgba(ff0000ee)",
})
hl.window_rule({
    match = {
        class = "[Ss]potify",
    },
    workspace = "special:spotify silent",
    tile = true,
    border_color = "#1ed760",
})
hl.window_rule({
    match = {
        title = "Waydroid",
    },
    fullscreen = true,
})
hl.window_rule({
    match = {
        class = "obsidian",
    },
    opacity = 0.91
})
hl.window_rule({
    match = {
        class = "steam_app_.*",
    },
    content = "game",
})
hl.window_rule({
    match = {
        title = ".*Moonlight",
    },
    content = "game",
})
-- Fix weird no fullscreen behavior
hl.window_rule({
    match = {
        title = ".* - Moonlight",
    },
    fullscreen = true,
})
hl.window_rule({
    match = {
        title = ".*Zen Browser Private Browsing"
    },
    no_screen_share = true,
})
hl.window_rule({
    match = {
        class = "xdg-desktop-portal-gtk",
    },
    no_screen_share = true,
})
hl.window_rule({
    match = {
        title = "GeoGuessr.*",
    },
    no_vrr = true,
})
hl.window_rule({
    match = {
        title = "Picture-in-Picture",
    },
    float = true,
    pin = true,
    keep_aspect_ratio = true,
    border_size = 1,
    no_anim = true,
    no_initial_focus = true,
    move = { "(monitor_w-window_w-1)", "(monitor_h-window_h-1)" },
})

hl.gesture({
    fingers = 3,
    direction = "horizontal",
    action = "workspace",
})
hl.gesture({
    fingers = 3,
    direction = "up",
    action = "fullscreen",
})
hl.gesture({
    fingers = 3,
    direction = "down",
    action = "float",
})
hl.gesture({
    fingers = 4,
    direction = "swipe",
    action = "resize",
})
hl.gesture({
    fingers = 3,
    direction = "pinchout",
    action = "close",
})

local mainMod = "SUPER + "
local shiftMod = "SHIFT + "
local altMod = "ALT + "

hl.bind(mainMod .. "X", hl.dsp.exec_cmd("alacritty -e ~/.local/bin/zellij-session"))
hl.bind(mainMod .. shiftMod .. "X", hl.dsp.exec_cmd("alacritty"))
hl.bind(mainMod .. "B", hl.dsp.exec_cmd("zen-browser"))
hl.bind(mainMod .. "R", hl.dsp.exec_cmd("vicinae toggle"))
hl.bind(mainMod .. "T", hl.dsp.exec_cmd("vicinae vicinae://extensions/vicinae/core/search-emojis"))
hl.bind(mainMod .. "E", hl.dsp.exec_cmd("thunar"))
hl.bind(mainMod .. shiftMod .. "C", hl.dsp.exec_cmd("hyprpicker -a -n"))
hl.bind(mainMod .. shiftMod .. "V", hl.dsp.exec_cmd("swaync-client -t"))
hl.bind("PRINT", hl.dsp.exec_cmd("~/.local/bin/screenshot-monitor"))
hl.bind(shiftMod .. "PRINT", hl.dsp.exec_cmd("~/.local/bin/screenshot-select"))
hl.bind(mainMod .. "PRINT", hl.dsp.exec_cmd("~/.local/bin/screenshot-window"))
hl.bind(mainMod .. "F1",
    hl.dsp.exec_cmd("otd applypreset artist && paplay /usr/share/sounds/freedesktop/stereo/dialog-warning.oga"))
hl.bind(mainMod .. "F2",
    hl.dsp.exec_cmd("otd applypreset normal && paplay /usr/share/sounds/freedesktop/stereo/dialog-warning.oga"))
hl.bind(mainMod .. "F3", hl.dsp.exec_cmd("systemctl --user restart opentabletdriver"))

hl.bind(mainMod .. "M", hl.dsp.exit())
hl.bind(mainMod .. "Q", hl.dsp.window.close())
hl.bind(mainMod .. "V", hl.dsp.window.float())
hl.bind(mainMod .. shiftMod .. "T", hl.dsp.window.pin())
hl.bind(mainMod .. "F", hl.dsp.window.fullscreen())
hl.bind(mainMod .. "C", hl.dsp.window.fullscreen({ mode = "maximized" }))
hl.bind(mainMod .. shiftMod .. "F", function()
    hl.dispatch(hl.dsp.window.fullscreen())
    hl.dispatch(hl.dsp.send_shortcut({ mods = "CTRL + ALT", key = "code:54" })) -- 54 is "c"
end)
hl.bind(mainMod .. "N", hl.dsp.exec_cmd("hyprlock"))
hl.bind(mainMod .. "ESCAPE", hl.dsp.exec_cmd("wlogout --protocol layer-shell -b 6 -T 400 -B 400"))
-- hl.bind(mainMod .. "P", hl.dsp.exec_cmd("/home/michal/.local/bin/hyprfreeze"))
hl.bind(mainMod .. "SEMICOLON", hl.dsp.exec_cmd("~/.local/bin/music-swap"))
if isRyzenekNew then
    hl.bind(mainMod .. "F9", hl.dsp.exec_cmd("ddcutil --enable-dynamic-sleep -d 1 setvcp 10 - 34"))
    hl.bind(mainMod .. "F10", hl.dsp.exec_cmd("ddcutil --enable-dynamic-sleep -d 1 setvcp 10 + 34"))
    hl.bind(mainMod .. "F11", hl.dsp.exec_cmd("ddcutil --enable-dynamic-sleep -d 2 setvcp 10 - 34"))
    hl.bind(mainMod .. "F12", hl.dsp.exec_cmd("ddcutil --enable-dynamic-sleep -d 2 setvcp 10 + 34"))
end
if isRyzenekOld then
    hl.bind(mainMod .. "F9", hl.dsp.exec_cmd("ddcutil --enable-dynamic-sleep -d 1 setvcp 10 - 34"))
    hl.bind(mainMod .. "F10", hl.dsp.exec_cmd("ddcutil --enable-dynamic-sleep -d 1 setvcp 10 + 34"))
end

hl.bind("XF86AudioRaiseVolume", hl.dsp.exec_cmd("swayosd-client --output-volume raise"),
    { locked = true, repeating = true, ignore_mods = true, })
hl.bind("XF86AudioLowerVolume", hl.dsp.exec_cmd("swayosd-client --output-volume lower"),
    { locked = true, repeating = true, ignore_mods = true, })
hl.bind("XF86AudioMute", hl.dsp.exec_cmd("swayosd-client --output-volume mute-toggle"),
    { locked = true, ignore_mods = true, })
hl.bind("XF86AudioMicMute", hl.dsp.exec_cmd("swayosd-client --input-volume mute-toggle"),
    { locked = true, ignore_mods = true, })
hl.bind("XF86MonBrightnessUp", hl.dsp.exec_cmd("swayosd-client --brightness raise"), { locked = true, repeating = true, ignore_mods = true, })
hl.bind("XF86MonBrightnessDown", hl.dsp.exec_cmd("swayosd-client --brightness lower"), { locked = true, repeating = true, ignore_mods = true, })
-- hl.bind("Caps_Lock", hl.dsp.exec_cmd("swayosd-client --caps-lock"), { locked = true, ignore_mods = true, })
hl.bind(mainMod .. "SLASH", hl.dsp.exec_cmd("waybar-mpris --send toggle || playerctl play-pause"))
hl.bind("XF86AudioPlay", hl.dsp.exec_cmd("waybar-mpris --send toggle || playerctl play-pause"),
    { locked = true, repeating = true, ignore_mods = true, })
hl.bind(mainMod .. "PERIOD", hl.dsp.exec_cmd("waybar-mpris --send next || playerctl next"))
hl.bind("XF86AudioNext", hl.dsp.exec_cmd("waybar-mpris --send next || playerctl next"),
    { locked = true, repeating = true, ignore_mods = true, })
hl.bind(mainMod .. "COMMA", hl.dsp.exec_cmd("waybar-mpris --send prev || playerctl previous"))
hl.bind("XF86AudioPrev", hl.dsp.exec_cmd("waybar-mpris --send prev || playerctl previous"),
    { locked = true, repeating = true, ignore_mods = true })
hl.bind("XF86Tools", hl.dsp.exec_cmd("blueberry"), { locked = true, repeating = true, ignore_mods = true, })
hl.bind("XF86Favorites", hl.dsp.exec_cmd("spotify-launcher"),
    { locked = true, repeating = true, ignore_mods = true, })
hl.bind("XF86Calculator", hl.dsp.exec_cmd("mathematica"), { locked = true, repeating = true, ignore_mods = true, })


hl.bind(mainMod .. "A", hl.dsp.focus({ direction = "left" }))
hl.bind(mainMod .. "D", hl.dsp.focus({ direction = "right" }))
hl.bind(mainMod .. "W", hl.dsp.focus({ direction = "up" }))
hl.bind(mainMod .. "S", hl.dsp.focus({ direction = "down" }))

hl.bind(mainMod .. shiftMod .. "A", hl.dsp.window.swap({ direction = "left" }))
hl.bind(mainMod .. shiftMod .. "D", hl.dsp.window.swap({ direction = "right" }))
hl.bind(mainMod .. shiftMod .. "W", hl.dsp.window.swap({ direction = "up" }))
hl.bind(mainMod .. shiftMod .. "S", hl.dsp.window.swap({ direction = "down" }))

hl.bind(mainMod .. "H", hl.dsp.window.move({ direction = "left" }))
hl.bind(mainMod .. "L", hl.dsp.window.move({ direction = "right" }))
hl.bind(mainMod .. "K", hl.dsp.window.move({ direction = "up" }))
hl.bind(mainMod .. "J", hl.dsp.window.move({ direction = "down" }))

hl.bind(mainMod .. shiftMod .. "H", hl.dsp.window.resize({ x = -20, y = 0, relative = true, }), { repeating = true, })
hl.bind(mainMod .. shiftMod .. "L", hl.dsp.window.resize({ x = 20, y = 0, relative = true, }), { repeating = true, })
hl.bind(mainMod .. shiftMod .. "K", hl.dsp.window.resize({ x = 0, y = -20, relative = true, }), { repeating = true, })
hl.bind(mainMod .. shiftMod .. "J", hl.dsp.window.resize({ x = 0, y = 20, relative = true }), { repeating = true })

hl.bind(mainMod .. "I", function()
    local ws = hl.get_active_workspace()
    if ws ~= nil then
        local workspaceName = ws.name
        local newLayout = ws.tiled_layout == "dwindle" and "scrolling" or "dwindle"
        hl.notification.create({ text = "Switching workspace " .. workspaceName .. " layout to " .. newLayout, duration = 3000 })
        hl.workspace_rule({
            workspace = workspaceName,
            layout = newLayout,
        })
    end
end)
hl.bind(mainMod .. "O", function ()
	local newValue = not hl.get_config("animations.enabled")
    hl.notification.create({ text = "Animations are now " .. (newValue and "enabled" or "disabled"), duration = 3000 })
    hl.config({
        animations = {
            enabled = newValue,
        },
	})
end)

hl.bind(mainMod .. "Z", hl.dsp.workspace.toggle_special("spotify"))
hl.bind(mainMod .. shiftMod .. "Z", hl.dsp.window.move({ workspace = "special:spotify" }))
hl.bind(mainMod .. "GRAVE", hl.dsp.workspace.toggle_special())
hl.bind(mainMod .. shiftMod .. "GRAVE", hl.dsp.window.move({ workspace = "special" }))

for i = 1, 10 do
    local key = i % 10
    hl.bind(mainMod .. key, hl.dsp.focus({ workspace = i }), { bypass = true, })
    hl.bind(mainMod .. shiftMod .. key, hl.dsp.window.move({ workspace = i }), { bypass = true, })
    hl.bind(mainMod .. altMod .. key, hl.dsp.window.move({ workspace = i, follow = false }), { bypass = true, })
end

hl.bind(mainMod .. "mouse_down", hl.dsp.focus({ workspace = "e+1" }))
hl.bind(mainMod .. "mouse_up", hl.dsp.focus({ workspace = "e-1" }))

hl.bind(mainMod .. "mouse:272", hl.dsp.window.drag(), { mouse = true })
hl.bind(mainMod .. "mouse:273", hl.dsp.window.resize(), { mouse = true })

-- hl.bind(mainMod .. shiftMod .. "Q", hl.dsp.exec_cmd("gedit", { workspace = "special:spotify silent" }))
