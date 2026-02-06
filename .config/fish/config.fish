if status is-interactive
    # Commands to run in interactive sessions can go here
end

if command -sq nvim
    alias vim="nvim"
end

#fish_add_path ~/.local/bin

if command -sq eza
    alias ls "eza"
    alias ll "eza -la"
end

if command -sq lazygit
    alias lg "lazygit"
end

set fish_greeting

alias dockerstart "sudo systemctl start docker"
alias dockerstop "sudo systemctl stop docker"

alias c="codium ."
alias zz="zeditor ."

# alias ubuntu "docker run --rm -it ubuntu:22.04 bash"

alias yayf="yay -Slq | fzf --multi --preview 'yay -Sii {1}' --preview-window=down:75% | xargs -ro yay -S"
#alias apti="apt-cache pkgnames | fzf --multi --preview 'apt-cache show {1}' --preview-window=down:75% | xargs -ro sudo apt install"
alias flatpaki="flatpak remote-ls --columns=application flathub | fzf --preview 'flatpak remote-info flathub {1}' --preview-window=down:75% | xargs -ro flatpak install flathub"
bind ctrl-f "zi; commandline -f repaint"

if [ $TERM = "xterm-256color" ] || [ $TERM = "xterm-kitty" ] || [ $TERM = "alacritty" ]
    set _distro (awk '/^ID=/' /etc/*-release | awk -F'=' '{ print tolower($2) }')

    switch $_distro
        case '*kali*'
            set -x STARSHIP_DISTRO ""
        case '*arch*'
            set -x STARSHIP_DISTRO ""
        case '*debian*'
            set -x STARSHIP_DISTRO ""
        case '*sabayon*'
            set -x STARSHIP_DISTRO ""
        case '*slackware*'
            set -x STARSHIP_DISTRO ""
        case '*linuxmint*'
            set -x STARSHIP_DISTRO ""
        case '*alpine*'
            set -x STARSHIP_DISTRO ""
        case '*aosc*'
            set -x STARSHIP_DISTRO ""
        case '*nixos*'
            set -x STARSHIP_DISTRO ""
        case '*devuan*'
            set -x STARSHIP_DISTRO ""
        case '*manjaro*'
            set -x STARSHIP_DISTRO ""
        case '*rhel*'
            set -x STARSHIP_DISTRO ""
        case '*cent*'
            set -x STARSHIP_DISTRO ""
        case '*rocky*'
            set -x STARSHIP_DISTRO ""
        case '*ubuntu*'
            set -x STARSHIP_DISTRO ""
        case '*pop*'
            set -x STARSHIP_DISTRO ""
        case '*'
            set -x STARSHIP_DISTRO ""
    end

    if command -sq starship
        starship init fish | source
    end
end
