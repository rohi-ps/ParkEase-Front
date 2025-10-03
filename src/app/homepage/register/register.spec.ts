// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { Register } from './register';

// describe('Register', () => {
//   let component: Register;
//   let fixture: ComponentFixture<Register>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [Register]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(Register);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
// describe('register logic',()=>
// {
//   const register= new Register();
//   it('register the email and password is not empty',()=>
//   {
//     expect(register.user.email).toBe('');
//     expect(register.user.password).toBe('');
//     expect(register.user.cpassword).toBe('');
//   })
//   it('password is valid or not',()=>
//   {
//     register.user.password='Durgaprasad@123'
//      expect(register.passwordvalidate(register.user.password)).toBeTrue();
//   })
// })