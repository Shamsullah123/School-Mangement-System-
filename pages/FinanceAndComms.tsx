import React, { useState } from 'react';
import { Card, Button, Input, Badge, Modal, Select } from '../components/UI';
import { MOCK_FEES, MOCK_STUDENTS } from '../services/mockData';
import { FeeRecord, User, UserRole } from '../types';
import { draftSMS } from '../services/geminiService';
import { Send, RefreshCw, Printer, Plus, Pencil, Trash2, CreditCard } from 'lucide-react';

export const Fees: React.FC<{ user?: User }> = ({ user }) => {
  const [fees, setFees] = useState<FeeRecord[]>(MOCK_FEES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeRecord | null>(null);
  const [selectedFeeForPayment, setSelectedFeeForPayment] = useState<FeeRecord | null>(null);

  const isParent = user?.role === UserRole.PARENT;

  // Filter fees if parent
  const displayedFees = isParent 
    ? fees.filter(f => f.studentName.includes('Johnson') || f.studentId === 'S001') // Mock filter for logged in parent
    : fees;

  // Form State
  const [formData, setFormData] = useState<Partial<FeeRecord>>({
    studentId: '',
    amount: 0,
    dueDate: '',
    status: 'Pending'
  });

  const handleOpenModal = (fee?: FeeRecord) => {
    if (fee) {
      setEditingFee(fee);
      setFormData(fee);
    } else {
      setEditingFee(null);
      setFormData({
        studentId: MOCK_STUDENTS[0].id,
        amount: 0,
        dueDate: new Date().toISOString().split('T')[0],
        status: 'Pending'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const student = MOCK_STUDENTS.find(s => s.id === formData.studentId);
    
    if (editingFee) {
      setFees(fees.map(f => f.id === editingFee.id ? { ...f, ...formData, studentName: student?.firstName + ' ' + student?.lastName } as FeeRecord : f));
    } else {
      const newFee: FeeRecord = {
        id: `F${Date.now()}`,
        studentId: formData.studentId!,
        studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown',
        amount: Number(formData.amount),
        dueDate: formData.dueDate!,
        status: formData.status as 'Paid' | 'Pending' | 'Overdue'
      };
      setFees([...fees, newFee]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this fee record?")) {
      setFees(fees.filter(f => f.id !== id));
    }
  };

  const handleOpenPayment = (fee: FeeRecord) => {
    setSelectedFeeForPayment(fee);
    setIsPaymentModalOpen(true);
  };

  const processPayment = () => {
    if (selectedFeeForPayment) {
      setFees(fees.map(f => f.id === selectedFeeForPayment.id ? { ...f, status: 'Paid' } as FeeRecord : f));
      setIsPaymentModalOpen(false);
      alert("Payment Successful!");
    }
  };

  const handlePrintInvoice = (fee: FeeRecord) => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (!printWindow) return;

    const html = `
      <html>
        <head>
          <title>Invoice - ${fee.id}</title>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #4f46e5; }
            .invoice-title { font-size: 32px; margin: 20px 0; }
            .details { margin-bottom: 30px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .label { font-weight: bold; color: #666; }
            .total { margin-top: 40px; border-top: 2px solid #eee; padding-top: 20px; text-align: right; font-size: 24px; font-weight: bold; }
            .status { display: inline-block; padding: 5px 10px; border-radius: 4px; font-size: 14px; margin-top: 10px; }
            .status.Paid { background: #dcfce7; color: #166534; }
            .status.Pending { background: #fef9c3; color: #854d0e; }
            .status.Overdue { background: #fee2e2; color: #991b1b; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">EduSphere School</div>
            <p>123 Education Lane, Academic City</p>
          </div>
          <h1 class="invoice-title">INVOICE</h1>
          <div class="details">
            <div class="row">
              <span class="label">Invoice ID:</span>
              <span>${fee.id}</span>
            </div>
            <div class="row">
              <span class="label">Date Issued:</span>
              <span>${new Date().toLocaleDateString()}</span>
            </div>
            <div class="row">
              <span class="label">Due Date:</span>
              <span>${fee.dueDate}</span>
            </div>
          </div>
          <div class="details" style="background: #f9fafb; padding: 20px; border-radius: 8px;">
            <div class="row">
              <span class="label">Bill To:</span>
              <span>${fee.studentName} (ID: ${fee.studentId})</span>
            </div>
            <div class="row">
              <span class="label">Description:</span>
              <span>Tuition Fees</span>
            </div>
          </div>
          <div class="total">
            Total: $${fee.amount.toFixed(2)}
          </div>
          <div style="text-align: right">
            <span class="status ${fee.status}">${fee.status}</span>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">{isParent ? "My Payments" : "Fee Management"}</h2>
        {!isParent && (
          <Button onClick={() => handleOpenModal()}>
            <Plus size={20} /> Add Fee Record
          </Button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-slate-600">Invoice ID</th>
              <th className="p-4 font-semibold text-slate-600">Student</th>
              <th className="p-4 font-semibold text-slate-600">Amount</th>
              <th className="p-4 font-semibold text-slate-600">Due Date</th>
              <th className="p-4 font-semibold text-slate-600">Status</th>
              <th className="p-4 font-semibold text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayedFees.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-slate-500">No records found.</td></tr>
            ) : (
              displayedFees.map(fee => (
                <tr key={fee.id}>
                  <td className="p-4 font-mono text-sm text-slate-500">{fee.id}</td>
                  <td className="p-4 font-medium text-slate-900">{fee.studentName}</td>
                  <td className="p-4 text-slate-600">${fee.amount}</td>
                  <td className="p-4 text-slate-600">{fee.dueDate}</td>
                  <td className="p-4"><Badge status={fee.status} /></td>
                  <td className="p-4 flex gap-2">
                    {/* Admin Actions */}
                    {!isParent && (
                      <>
                        <Button variant="secondary" className="text-xs px-2 py-1 h-auto" onClick={() => handleOpenModal(fee)}>
                          <Pencil size={14} /> Edit
                        </Button>
                        <Button variant="danger" className="text-xs px-2 py-1 h-auto" onClick={() => handleDelete(fee.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </>
                    )}
                    
                    {/* Parent Actions */}
                    {isParent && fee.status !== 'Paid' && (
                       <Button className="text-xs px-3 py-1 h-auto bg-green-600 hover:bg-green-700" onClick={() => handleOpenPayment(fee)}>
                          <CreditCard size={14} /> Pay Now
                       </Button>
                    )}

                    <Button variant="outline" className="text-xs px-2 py-1 h-auto" onClick={() => handlePrintInvoice(fee)}>
                      <Printer size={14} /> Print
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Admin Add/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingFee ? "Edit Fee Record" : "Add New Fee"}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Select 
            label="Student" 
            value={formData.studentId} 
            onChange={e => setFormData({...formData, studentId: e.target.value})}
            required
          >
            {MOCK_STUDENTS.map(s => (
              <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
            ))}
          </Select>
          <Input 
            label="Amount ($)" 
            type="number" 
            value={formData.amount} 
            onChange={e => setFormData({...formData, amount: Number(e.target.value)})}
            required
          />
          <Input 
            label="Due Date" 
            type="date" 
            value={formData.dueDate} 
            onChange={e => setFormData({...formData, dueDate: e.target.value})}
            required
          />
          <Select 
            label="Status" 
            value={formData.status} 
            onChange={e => setFormData({...formData, status: e.target.value as any})}
          >
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </Select>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingFee ? "Update Record" : "Create Record"}</Button>
          </div>
        </form>
      </Modal>

      {/* Payment Modal for Parents */}
      <Modal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        title="Secure Payment"
      >
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
             <p className="text-sm text-slate-500 mb-1">Total Amount Due</p>
             <p className="text-3xl font-bold text-slate-800">${selectedFeeForPayment?.amount.toFixed(2)}</p>
             <p className="text-xs text-slate-400 mt-2">Invoice #{selectedFeeForPayment?.id}</p>
          </div>
          
          <div className="space-y-3">
             <Input label="Card Number" placeholder="0000 0000 0000 0000" />
             <div className="grid grid-cols-2 gap-4">
                <Input label="Expiry Date" placeholder="MM/YY" />
                <Input label="CVC" placeholder="123" />
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setIsPaymentModalOpen(false)}>Cancel</Button>
            <Button onClick={processPayment} className="bg-green-600 hover:bg-green-700">Confirm Payment</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const SMS: React.FC = () => {
  const [selectedStudentId, setSelectedStudentId] = useState(MOCK_STUDENTS[0].id);
  const [topic, setTopic] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const student = MOCK_STUDENTS.find(s => s.id === selectedStudentId) || MOCK_STUDENTS[0];

  const handleAIDraft = async () => {
    if (!topic) {
      alert("Please enter a topic first.");
      return;
    }
    setLoading(true);
    const draft = await draftSMS(student.parentName, topic, student.firstName);
    setMessage(draft);
    setLoading(false);
  };

  const handleSend = () => {
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setMessage('');
      setTopic('');
      alert(`Message sent to ${student.parentPhone}`);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Parent Communication System (SMS)</h2>
      
      <Card>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Student</label>
            <select 
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
            >
              {MOCK_STUDENTS.map(s => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName} (Parent: {s.parentName})</option>
              ))}
            </select>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Message Topic</label>
             <div className="flex gap-2">
               <input 
                  type="text" 
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-md" 
                  placeholder="e.g. Unpaid fees, Disciplinary issue, Excellence award"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
               />
               <Button onClick={handleAIDraft} disabled={loading} variant="secondary">
                 {loading ? <RefreshCw className="animate-spin w-4 h-4" /> : "AI Draft"}
               </Button>
             </div>
             <p className="text-xs text-slate-500 mt-1">Use AI to compose polite and professional messages instantly.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Message Content</label>
            <textarea 
              className="w-full px-3 py-2 border border-slate-300 rounded-md h-32"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
            ></textarea>
            <div className="text-right text-xs text-slate-400 mt-1">
              {message.length} characters
            </div>
          </div>

          <Button onClick={handleSend} disabled={!message || sent} className="w-full">
            {sent ? "Sending..." : <><Send size={18} /> Send SMS</>}
          </Button>
        </div>
      </Card>
    </div>
  );
};