import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-vendas',
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.css']
})
export class VendasComponent implements OnInit {

  vendas: any;
  vendaForm: FormGroup;
  selectedVenda: any = { id: '', cliente_id: '', produto_id: '', quantidade: '', valor: '' };
  selectedVendaVoid: any = { id: '', cliente_id: '', produto_id: '', quantidade: '', valor: '' };

  constructor(private apiService: ApiService, private formBuilder: FormBuilder) {
    this.vendaForm = this.formBuilder.group({
      id: [''],
      cliente_id: [''],
      produto_id: [''],
      quantidade: [''],
      valor: ['']
    });
  }

  ngOnInit(): void {
    this.getVendas();
  }

  getVendas(): void {
    this.apiService.getVendas().subscribe((data) => {
      this.vendas = data;
    });
  }

  createOrUpdateVenda(): void {
    console.log(this.vendaForm);
    if (this.selectedVenda && this.selectedVenda.id) {
      this.apiService.updateVenda(this.vendaForm.value.id, this.vendaForm.value).subscribe(() => {
        this.getVendas();
      });
    } else {
      this.apiService.createVenda(this.vendaForm.value).subscribe(() => {
        this.getVendas();
      });
    }
    this.clearForm();
  }

  selectVenda(venda: any): void {
    console.log(venda);
    this.selectedVenda = venda;
    this.vendaForm.setValue({
      id: this.selectedVenda.id,
      cliente_id: this.selectedVenda.cliente_id,
      produto_id: this.selectedVenda.produto_id,
      quantidade: this.selectedVenda.quantidade,
      valor: this.selectedVenda.valor
    });
  }

  deleteVenda(id: any): void {
    this.apiService.deleteVenda(id).subscribe(() => {
      this.getVendas();
    });
    this.clearForm();
  }

  clearForm(): void {
    this.vendaForm.reset();
  }

}
