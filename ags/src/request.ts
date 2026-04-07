import app from "ags/gtk4/app";

export const request = (args: string[], response: (res: string) => void) => {
  console.log("Request: ", JSON.stringify(args));
  app.get_window("power")?.set_visible(true);
  return response("Ok");
};