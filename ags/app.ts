import app from "ags/gtk4/app";
import style from "./style.scss";
import { main } from "./src/main";
import { request } from "./src/request";

app.start({
	css: style,
  main,
  requestHandler: request,
});
