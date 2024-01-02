import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MaterialModule } from 'material.module';
import { RouterModule } from '@angular/router';

import { PendudukPindahComponent } from './penduduk-pindah.component';
import { pendudukPindahRoute } from './penduduk-pindah.route';
import { PendudukPindahCreateComponent } from './penduduk-pindah-create/penduduk-pindah-create.component';
import { DetailPendudukPindahComponent } from './detail-penduduk-pindah/detail-penduduk-pindah.component';
@NgModule({
  declarations: [
    PendudukPindahCreateComponent,
    DetailPendudukPindahComponent,
    // PendudukCreateComponent,
    // PendudukUpdateComponent,
  ],
  imports: [
    // CommonModule,
    MaterialModule,
    RouterModule.forChild(pendudukPindahRoute),
  ],
  // exports: [RouterModule],

  entryComponents: [PendudukPindahComponent],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // Add MessageService to the providers array
})
export class PendudukPindahModule {}
