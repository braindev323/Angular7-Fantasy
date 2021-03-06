import { Injectable } from '@angular/core';


interface Scripts {
  name: string;
  src: string;
}
export const ScriptStore: Scripts[] = [
  { name: 'chartjs', src: '../assets/js/Chart.bundle.min.js' },
  { name: 'fantasy-register-pulse', src: '../assets/js/pulse.min.js' }
];

declare var document: any;

@Injectable({
  providedIn: 'root'
})

export class GlobalService {

  auth = false;
  loading:boolean = true;
  registering:boolean = false;
  constructor() {
    if (localStorage.getItem("auth") == "yes")
      this.auth = true
    // script load
    ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src
      };
    });
  }
  //loading helper
  setLoding() {
    this.loading = true;
  }
  finishLoading() {
    this.loading = false;
  }
  // auth control
  login() {
    localStorage.setItem("auth", "yes");
  }
  logout() {
    localStorage.removeItem("auth");
    this.auth = true;
  }

  // script load
  private scripts: any = {};

  load(...scripts: string[]) {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }

  loadScript(name: string) {
    return new Promise((resolve, reject) => {
      if (!this.scripts[name].loaded) {
        //load script
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        if (script.readyState) {  //IE
          script.onreadystatechange = () => {
            if (script.readyState === "loaded" || script.readyState === "complete") {
              script.onreadystatechange = null;
              this.scripts[name].loaded = true;
              resolve({ script: name, loaded: true, status: 'Loaded' });
            }
          };
        } else {  //Others
          script.onload = () => {
            this.scripts[name].loaded = true;
            resolve({ script: name, loaded: true, status: 'Loaded' });
          };
        }
        script.onerror = (error: any) => resolve({ script: name, loaded: false, status: 'Loaded' });
        document.getElementsByTagName('head')[0].appendChild(script);
      } else {
        resolve({ script: name, loaded: true, status: 'Already Loaded' });
      }
    });
  }
}
