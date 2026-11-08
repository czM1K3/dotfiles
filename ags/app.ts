import app from "ags/gtk4/app";
import style from "./style.scss";
import { main } from "./src/main";

app.start({
	css: style,
	main,
});
