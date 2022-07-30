if status is-interactive
    # Commands to run in interactive sessions can go here
end

if command -sq nvim
    alias vim="nvim"
end

set fish_greeting

alias dockerstart "sudo systemctl start docker portainer"
alias dockerstop "sudo systemctl stop docker portainer"

alias c="codium ."

alias ubuntu "docker run --rm -it ubuntu:20.04 bash"

set _distro (awk '/^ID=/' /etc/*-release | awk -F'=' '{ print tolower($2) }')

switch $_distro
    case '*kali*'
        set -x STARSHIP_DISTRO "ﴣ"
    case '*arch*'
        set -x STARSHIP_DISTRO ""
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
    case '*'
        set -x STARSHIP_DISTRO ""
end

starship init fish | source
