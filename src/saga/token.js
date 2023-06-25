export class TokenService {
  static set({ key, value }) {
    localStorage.setItem(key.value);
  }
  static get({ key, value }) {
    localStorage.getItem(key);
  }
  static remove({ key, value }) {
    localStorage.removeItem(key);
  }
}
