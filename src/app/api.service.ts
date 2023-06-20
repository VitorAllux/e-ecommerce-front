import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseURL = "http://localhost:8000/api";

  constructor(private http: HttpClient) { }

  //clients
  getClientes(): Observable<any> {
    return this.http.get(`${this.baseURL}/clientes`);
  }

  getCliente(id: number): Observable<any> {
    return this.http.get(`${this.baseURL}/clientes/${id}`);
  }

  createCliente(cliente: Object): Observable<Object> {
    return this.http.post(`${this.baseURL}/clientes`, cliente);
  }

  updateCliente(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseURL}/clientes/${id}`, value);
  }

  deleteCliente(id: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/clientes/${id}`);
  }

  //products
  getProdutos(): Observable<any> {
    return this.http.get(`${this.baseURL}/produtos`);
  }

  getProduto(id: number): Observable<any> {
    return this.http.get(`${this.baseURL}/produtos/${id}`);
  }

  createProduto(produto: Object): Observable<Object> {
    return this.http.post(`${this.baseURL}/produtos`, produto);
  }

  updateProduto(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseURL}/produtos/${id}`, value);
  }

  deleteProduto(id: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/produtos/${id}`);
  }

  //sells
  getVendas(): Observable<any> {
    return this.http.get(`${this.baseURL}/vendas`);
  }

  getVenda(id: number): Observable<any> {
    return this.http.get(`${this.baseURL}/vendas/${id}`);
  }

  createVenda(venda: Object): Observable<Object> {
    return this.http.post(`${this.baseURL}/vendas`, venda);
  }

  updateVenda(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseURL}/vendas/${id}`, value);
  }

  deleteVenda(id: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/vendas/${id}`);
  }

}
