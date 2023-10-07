export function restPropsNotClass(props: Record<string, any>){
  let res = {...props}
  delete res["class"];
  return res;
}

export function updateArrayItem(values: any[], item: any) {
  return [
    ...values.filter(f => f.id !== item.id),
    item
  ];
}


const PROD = true;

export function apiFetch(
  path: string,
  init?: RequestInit
):
 Promise<Response> {
  const url = PROD ? `https://${path}-yndtdyuria-ey.a.run.app` : 
    "http://127.0.0.1:5001/gpt-demos/europe-west3/" + path;
  return fetch(url, init);
}



export function onEnterKey(cb: any) {
  return (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      let el = e.target as (HTMLInputElement | null);
      if (!el) return;
      cb(el.value);
      el.value = "";      
      e.preventDefault();
    }
  }
}

