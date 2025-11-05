// src/app/app.module.ts (Frontend)

import { NgModule } from '@angular/core';
// ... other imports
import { HttpClientModule } from '@angular/common/http'; // <-- Import this

@NgModule({
  declarations: [
    // ...
  ],
  imports: [
    // ...
    HttpClientModule // <-- Add to imports array
  ],
  providers: [],
//   bootstrap: [AppComponent]
})
export class AppModule { }