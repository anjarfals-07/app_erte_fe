import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MaterialModule } from 'material.module';
import { RouterModule } from '@angular/router';
import { suratPengantarRoute } from './surat-pengantar.route';
import { SuratPengantarComponent } from './surat-pengantar.component';
import { SuratPengantarDialogComponent } from './surat-pengantar-create/surat-pengantar-dialog.component';
@NgModule({
  declarations: [SuratPengantarDialogComponent],
  imports: [
    // CommonModule,
    MaterialModule,
    RouterModule.forChild(suratPengantarRoute),
  ],
  // exports: [RouterModule],

  entryComponents: [SuratPengantarComponent],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // Add MessageService to the providers array
})
export class SuratPengantarModule {}
