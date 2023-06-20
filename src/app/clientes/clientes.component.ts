import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: any;
  clienteForm: FormGroup;
  selectedCliente: any = { id: '', nome: '', cpf: '', telefone: '', endereco: '' };
  selectedClienteVoid: any = { id: '', nome: '', cpf: '', telefone: '', endereco: '' };


  constructor(private apiService: ApiService, private formBuilder: FormBuilder) {
    this.clienteForm = this.formBuilder.group({
      id: [''],
      nome: [''],
      cpf: [''],
      telefone: [''],
      endereco: [''],
    })
  }

  ngOnInit(): void {
    this.getClientes();
  }

  getClientes(): void {
    this.apiService.getClientes().subscribe((data) => {
      this.clientes = data;
    });
  }

  createOrUpdateCliente(): void {
    console.log(this.clienteForm);
    if(this.selectedCliente && this.selectedCliente.id) {
      this.apiService.updateCliente(this.clienteForm.value.id, this.clienteForm.value).subscribe(() => {
        this.getClientes();
      });
    } else {
      this.apiService.createCliente(this.clienteForm.value).subscribe(() => {
        this.getClientes();
      });
    }
  }

  selectCliente(cliente: any): void {
    console.log(cliente);
    this.selectedCliente = cliente;
    this.clienteForm.setValue({
      id: this.selectedCliente.id,
      nome: this.selectedCliente.nome,
      cpf: this.selectedCliente.cpf,
      telefone: this.selectedCliente.telefone,
      endereco: this.selectedCliente.endereco
    });
  }

  deleteCliente(id: any): void {
    this.apiService.deleteCliente(id).subscribe(() => {
      this.getClientes();
    });
    this.clearForm();
  }

  clearForm(): void {
    this.clienteForm.reset();
  }

}
