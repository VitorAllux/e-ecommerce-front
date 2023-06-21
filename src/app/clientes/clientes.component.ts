import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ApiService } from '../api.service';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: any;
  clienteForm: FormGroup;
  filtro: any = { cliente_nome: null }
  selectedCliente: any = { id: '', nome: '', cpf: '', telefone: '', endereco: '' };
  selectedClienteVoid: any = { id: '', nome: '', cpf: '', telefone: '', endereco: '' };

  constructor(private apiService: ApiService, private formBuilder: FormBuilder, private appComponent: AppComponent) {
    this.clienteForm = this.formBuilder.group({
      id: [''],
      nome: [''],
      cpf: [''],
      telefone: [''],
      endereco: [''],
    });
  }

  ngOnInit(): void {
    this.getClientes();
  }

  getClientes(): void {
    this.apiService.getClientes().subscribe((data) => {
      if (this.filtro.cliente_nome) {
        data = data.filter((cliente: { nome: any; }) => this.compareStrings(cliente.nome, this.filtro.cliente_nome))
      }
      this.clientes = data;
    });
  }

  createOrUpdateCliente(): void {
    console.log(this.clienteForm);
    if (this.selectedCliente && this.selectedCliente.id) {
      this.apiService.updateCliente(this.clienteForm.value.id, this.clienteForm.value).subscribe(
        () => {
          this.appComponent.showSuccess('Cliente atualizado com sucesso.');
          this.getClientes();
        },
        (error) => {
          this.appComponent.showError('Erro ao atualizar o cliente. Verifique se o ID já existe.');
        }
      );
    } else {
      this.apiService.createCliente(this.clienteForm.value).subscribe(
        () => {
          this.appComponent.showSuccess('Cliente criado com sucesso.');
          this.getClientes();
        },
        (error) => {
          this.appComponent.showError('Erro ao criar o cliente. Verifique se o ID já existe.');
        }
      );
    }
    this.clearForm();
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
    this.apiService.deleteCliente(id).subscribe(
      () => {
        this.appComponent.showSuccess('Cliente excluído com sucesso.');
        this.getClientes();
      },
      (error) => {
        this.appComponent.showError('Erro ao excluir o cliente.');
      }
    );
    this.clearForm();
  }

  clearForm(): void {
    this.clienteForm.reset();
  }

  unacentLowerCase(string: string): string {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  compareStrings(produtoNome: string = '', filtroString: string = ''): boolean {
    console.log(this.unacentLowerCase(produtoNome));
    console.log(this.unacentLowerCase(filtroString));

    return this.unacentLowerCase(produtoNome).includes(this.unacentLowerCase(filtroString));
  }

  limparFiltros(): void {
    this.filtro.cliente_nome = null;
    this.getClientes();
  }

}
