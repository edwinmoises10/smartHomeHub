export interface DeviceProps {
  name: string;
  brand: string;
}

export class SmartDevice implements DeviceProps {
  public isOn: boolean = false;

  constructor(public name: string, public brand: string) {}

  togglePower() {
    this.isOn = !this.isOn;
  }
}

export class SmartLight extends SmartDevice {
  constructor(
    name: string,
    brand: string,
    public brightness: number,
    public color: string
  ) {
    super(name, brand);
  }
}

export class SmartHeater extends SmartDevice {
  constructor(name: string, brand: string, public temperature: number) {
    super(name, brand);
  }

  statusReport(): string {
    return `Calentando a ${this.temperature}`;
  }
}

export class HomeManager<T> {
  private readonly STORAGE_KEY = "my-smart_home_data";
  private container: T[] = [];

  private saveToStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.container));
  }

  private loadFromStorage() {
    let backupRaw = localStorage.getItem(this.STORAGE_KEY);

    if (backupRaw) {
      const dataRecover= JSON.parse(backupRaw);
      this.container = dataRecover.map((item : any) => {
        if ("brightness" in item) {
          const light = new SmartLight(
            item.name,
            item.brand,
            item.brightness,
            item.color
          );
          light.isOn = item.isOn;
          return light;
        } else if ("temperature" in item) {
          const heater = new SmartHeater(
            item.name,
            item.brand,
            item.temperature
          );
          heater.isOn = item.isOn;
          return heater;
        } else {
          const device = new SmartDevice(item.name, item.brand);
          device.isOn = item.isOn;
          return device;
        }
      }) as T[];
    }
  }

  constructor() {
    this.loadFromStorage();
  }

  addDevice(items: T) {
    this.container.push(items);
    this.saveToStorage();
  }

  getDevices() {
    return this.container;
  }
}
