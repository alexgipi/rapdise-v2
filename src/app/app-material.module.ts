import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Componentes Angular Material
import { MatSliderModule } from '@angular/material/slider';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatBadgeModule} from '@angular/material/badge';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider'
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatChipsModule} from '@angular/material/chips';

import {DragDropModule} from '@angular/cdk/drag-drop';

import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import { MaterialFileInputModule } from 'ngx-material-file-input';


@NgModule({
  imports: [
    CommonModule,
    MatSliderModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatTooltipModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    MatDialogModule,
    MatListModule,
    MatGridListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatChipsModule,
    DragDropModule,
    MatCheckboxModule,
    MatRadioModule,
    MatProgressBarModule,
    MaterialFileInputModule
  ],
  exports: [
    MatSliderModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatTooltipModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatDividerModule,
    MatCardModule,
    MatDialogModule,
    MatListModule,
    MatGridListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatChipsModule,
    DragDropModule,
    MatCheckboxModule,
    MatRadioModule,
    MatProgressBarModule,
    MaterialFileInputModule
  ]
})
export class AppMaterialModule { }