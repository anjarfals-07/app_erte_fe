import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MaterialModule } from 'material.module';
import { PendudukMeninggalComponent } from './penduduk-meninggal.component';
import { RouterModule } from '@angular/router';
import { pendudukMeninggalRoute } from './penduduk-meninggal.route';
import { PendudukMeninggalCreateComponent } from './penduduk-meninggal-create/penduduk-meninggal-create.component';

@NgModule({
  declarations: [
    PendudukMeninggalCreateComponent,
    // PendudukUpdateComponent,
  ],
  imports: [
    // CommonModule,
    MaterialModule,
    RouterModule.forChild(pendudukMeninggalRoute),
  ],
  // exports: [RouterModule],

  entryComponents: [],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // Add MessageService to the providers array
})
export class PendudukMeninggalModule {}
