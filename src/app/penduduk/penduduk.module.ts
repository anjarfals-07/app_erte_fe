import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppModule } from '../app.module';
import { PendudukComponent } from './penduduk.component';
import { MaterialModule } from 'material.module';
import { PendudukCreateComponent } from './penduduk-create/penduduk-create.component';
import { RouterModule } from '@angular/router';
import { PendudukResolve, pendudukRoute } from './penduduk.route';
import { MessageService } from 'primeng/api';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { PendudukUpdateComponent } from './penduduk-update/penduduk-update.component';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    // PendudukComponent,
    PendudukCreateComponent,
    PendudukUpdateComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(pendudukRoute),
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatExpansionModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  exports: [RouterModule],

  entryComponents: [PendudukCreateComponent, PendudukUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // Add MessageService to the providers array
})
export class PendudukModule {}
