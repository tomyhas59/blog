import moment from "moment";

export function formatDate(date: moment.MomentInput) {
  return moment(date).format("l").replace(/\.$/, "");
}
