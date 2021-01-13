import { apiRequest } from './request'

export type AuthListner = ((isAuthed: boolean) => void)
export class Auth {
  private static _inst: Auth
  private _key = ''
  private _isAuthed = false
  private authStateListners: { [id: string]: AuthListner } = {}

  static get inst (): Auth {
    return Auth._inst ? Auth._inst : Auth._inst = new Auth()
  }

  static get key (): string {
    return Auth.inst._key || ''
  }

  static get isAuthed (): boolean {
    return Auth.inst._isAuthed || false
  }

  static validate (key: string): Promise<boolean> {
    return Auth.inst.validate(key)
  }

  static registerListner (id: string, cb: AuthListner) {
    Auth.inst.authStateListners[id] = cb
  }

  private notifyListners () {
    for (const key in this.authStateListners) {
      const listner = this.authStateListners[key]
      try {
        listner(this._isAuthed)
      } catch (e) {
        console.log('Removing listner: ', key)
        delete this.authStateListners[key]
      }
    }
  }

  private async validate (key: string): Promise<boolean> {
    this._key = ''
    this._isAuthed = false
    const response = await apiRequest('/api/validate', 'POST', { key })
    if (response.status === 200) {
      this._key = key
      this._isAuthed = true
    }

    this.notifyListners()
    return this._isAuthed
  }

}