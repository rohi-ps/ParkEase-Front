import { CustomerService } from './customer-service';
describe('CustomerService', () => {
  let service: CustomerService;
  beforeEach(() => {
    service = new CustomerService();
  });
  it('should add a new customer', () => {
    service.addtocustomer('A1','TN12GH3456','2W','2025-09-26','10:00','2025-09-26','12:00','','');
    const added = service.getallUsers()[0];
    expect(added.slotId).toBe('A1');
    expect(added.status).toBe('Upcoming');
  });
  it('should calculate correct duration in minutes', () => {
    const minutes = service.calculateDurationInMinutes('2025-09-26','10:00','2025-09-26','11:30');
    expect(minutes).toBe(90);
  });
});

