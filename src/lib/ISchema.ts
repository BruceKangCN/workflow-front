export interface IValue {
  label: string,
  value: string,
}

export interface IComponent {
  key: string,
  label: string,
  type: string,
  values?: IValue[]
}

export interface IExporter {
  name: string,
  version?: string | number,
}

export interface ISchema {
  schemaVersion?: number,
  exporter?: IExporter,
  type: string,
  components: IComponent[],
}
