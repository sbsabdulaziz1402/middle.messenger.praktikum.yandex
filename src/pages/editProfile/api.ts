import HTTPTransport from "../../utils/FetchAPI";

const $api = new HTTPTransport ();

export function updateProfile(data: {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
}) {
  $api.put("https://ya-praktikum.tech/api/v2/user/profile", { data }).then(res=>{
    window.localStorage.setItem('userData', JSON.stringify(res))
  });
}

export function updatePassword(data: {
  oldPassword: string;
  newPassword: string;
}) {
  return $api.put("https://ya-praktikum.tech/api/v2/user/password", { data });
}

export function updateAvatar(data: FormData) {
  return $api.put("https://ya-praktikum.tech/api/v2/user/profile/avatar", {
    data,
    headers: {}, 
  });
}