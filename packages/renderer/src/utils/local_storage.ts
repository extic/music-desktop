class LocalStorage {
  setValue(key: string, value: any) {
    localStorage.setItem(key, value.toString());
  }

  getBoolean(key: string, defaultValue: boolean): boolean {
    return (localStorage.getItem(key) ?? defaultValue.toString()) === "true";
  }

  getNumber(key: string, defaultValue: number): number {
    return Number(localStorage.getItem(key) ?? defaultValue.toString());
  }
}

export const storage = new LocalStorage();
