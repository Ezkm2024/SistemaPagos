export interface Cliente{
    idPago?: number;
    idEmpresa: number;
    nombreCliente: string;
    apellidoCliente: string;
    importe: number;
    metodoDePago: string;
    fechaDePago: string;
}