import AstalWp from "gi://AstalWp";
import { createBinding, createComputed } from "gnim";

export const getVolumeIcon = (speaker?: AstalWp.Endpoint) => {
   let volume = speaker?.volume;
   let muted = speaker?.mute;
   let speakerIcon = speaker?.icon;
   if (volume == null || speakerIcon == null) return "";

   if (volume === 0 || muted) {
      return "ds-volume-x-symbolic";
   } else if (volume < 0.33) {
      return "ds-volume-symbolic";
   } else if (volume < 0.66) {
      return "ds-volume-1-symbolic";
   } else {
      return "ds-volume-2-symbolic";
   }
}

const wp = AstalWp.get_default();
const speaker = wp?.audio.defaultSpeaker!;
const speakerVar = createComputed(() => [
   createBinding(speaker, "description")(),
   createBinding(speaker, "volume")(),
   createBinding(speaker, "mute")(),
]);
export const VolumeIcon = speakerVar(() => getVolumeIcon(speaker));