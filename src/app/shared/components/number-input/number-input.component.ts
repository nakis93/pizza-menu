import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-number-input',
  imports: [],
  templateUrl: './number-input.component.html',
  styleUrl: './number-input.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NumberInputComponent,
      multi: true
    }
  ]
})
export class NumberInputComponent implements ControlValueAccessor {
  @Input() step = 0.01;
  @Input() min = 0;
  @Input() max = 9999;
  value: number = 0;
  disabled = false;

  onChange = (_: any) => { };
  onTouched = () => { };

  writeValue(value: number): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  onInputChange(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    const parsed = parseFloat(input);
    const safeValue = isNaN(parsed) ? 0 : Math.max(this.min, Math.min(parsed, this.max));
    this.value = safeValue;
    this.onChange(safeValue);
    this.onTouched();
  }
}
