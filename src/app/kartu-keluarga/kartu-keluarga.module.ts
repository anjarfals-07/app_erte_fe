import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MaterialModule } from 'material.module';
import { RouterModule } from '@angular/router';
import { KartuKeluargaComponent } from './kartu-keluarga.component';
import { kartuKeluargaRoute } from './kartu-keluarga.route';
@NgModule({
  declarations: [],
  imports: [
    // CommonModule,
    MaterialModule,
    RouterModule.forChild(kartuKeluargaRoute),
  ],
  // exports: [RouterModule],

  entryComponents: [KartuKeluargaComponent],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // Add MessageService to the providers array
})
export class KartuKeluargaModule {}
