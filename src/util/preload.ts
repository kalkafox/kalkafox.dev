import { getUserAvatarURL } from "./gravatar"

const avatarPreload = document.getElementById('avatar-preload') as HTMLLinkElement

avatarPreload.href = getUserAvatarURL("kalka2088@gmail.com")
