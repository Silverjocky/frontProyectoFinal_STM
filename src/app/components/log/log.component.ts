// src/app/components/supplier/supplier.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { SuppliersService } from '../../services/logs.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

interface Supplier {
  supplierId: number;
  contact: string;
  name: string;
  phone: string;
}

@Component({
  selector: 'app-supplier',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModule],
})
export class LogComponent implements OnInit {
  @ViewChild('supplierModal') supplierModal: any;
  listadoSuppliers: Supplier[] = [];
  loading = false;
  supplierForm: FormGroup;
  isEditMode = false;
  currentSupplierId: number | null = null;

  constructor(
    private suppliersService: SuppliersService,
    public authService: AuthService,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.supplierForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      contact: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  ngOnInit() {
    this.cargarSuppliers();
  }

  cargarSuppliers() {
    if (this.authService.hasAuthority('READ')) {
      this.loading = true;
      this.suppliersService.getSuppliers().subscribe({
        next: (response) => {
          this.listadoSuppliers = Array.isArray(response.suppliers) ? response.suppliers : [response.suppliers];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar los proveedores:', error);
          this.loading = false;
        },
      });
    }
  }

  createSupplier() {
    this.isEditMode = false;
    this.supplierForm.reset();
    this.modalService.open(this.supplierModal, { backdrop: 'static', size: 'lg' });
  }

  editSupplier(supplier: Supplier) {
    this.isEditMode = true;
    this.currentSupplierId = supplier.supplierId;
    this.supplierForm.patchValue({
      name: supplier.name,
      contact: supplier.contact,
      phone: supplier.phone
    });
    this.modalService.open(this.supplierModal, { backdrop: 'static', size: 'lg' });
  }


  
  eliminarSupplier(supplierId: number) {
    if (this.authService.hasAuthority('DELETE')) {
      if (confirm('¿Está seguro que desea eliminar este proveedor?')) {
        this.suppliersService.deleteSupplier(supplierId).subscribe({
          next: () => {
            this.cargarSuppliers();
          },
          error: (error) => {
            console.error('Error al eliminar el proveedor:', error);
          },
        });
      }
    } else {
      alert('No tienes permiso para eliminar proveedores.');
    }
  }

  onSubmitSupplier(modal: any) {
    if (this.supplierForm.invalid) {
      return;
    }

    const supplierData: Partial<Supplier> = {
      ...this.supplierForm.value
    };

    if (this.isEditMode && this.currentSupplierId) {
      if (!this.authService.hasAuthority('UPDATE')) {
        alert('No tienes permiso para actualizar proveedores.');
        return;
      }
      this.suppliersService.updateSupplier(this.currentSupplierId, supplierData).subscribe({
        next: () => {
          modal.close();
          this.cargarSuppliers();
        },
        error: (err) => {
          console.error('Error al actualizar el proveedor:', err);
        },
      });
    } else {
      if (!this.authService.hasAuthority('CREATE')) {
        alert('No tienes permiso para crear proveedores.');
        return;
      }
      this.suppliersService.createSupplier(supplierData).subscribe({
        next: () => {
          modal.close();
          this.cargarSuppliers();
        },
        error: (err) => {
          console.error('Error al crear el proveedor:', err);
        },
      });
    }
  }
}