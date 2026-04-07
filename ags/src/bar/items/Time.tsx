import { createPoll } from "ags/time";

export const Time = () => {
  const time = createPoll("", 1000, 'env LC_ALL=cs_CZ.utf8 date "+%e.%B %H:%M:%S"');
  
  return (
    <box class="bar-item time">
      <label label={time} />
    </box>
  )
};