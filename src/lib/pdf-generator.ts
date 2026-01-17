import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface OrderData {
  orderNumber: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  orderDate: string;
  dueDate?: string;
  status: string;
  paymentStatus: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  notes?: string;
}

const statusLabels: Record<string, string> = {
  DRAFT: "Rascunho",
  CONFIRMED: "Confirmado",
  PROCESSING: "Em Processamento",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
};

const paymentStatusLabels: Record<string, string> = {
  PENDING: "Pendente",
  PARTIAL: "Parcial",
  PAID: "Pago",
  OVERDUE: "Vencido",
};

export function generateOrderPDF(order: OrderData) {
  const doc = new jsPDF();

  // Cores
  const primaryColor: [number, number, number] = [79, 70, 229]; // Indigo
  const secondaryColor: [number, number, number] = [100, 116, 139]; // Slate

  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("PEDIDO DE VENDA", 15, 20);

  doc.setFontSize(12);
  doc.text(`Nº ${order.orderNumber}`, 15, 30);

  // Reset cor
  doc.setTextColor(0, 0, 0);

  // Informações do Cliente
  let yPos = 50;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Cliente", 15, yPos);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  yPos += 7;
  doc.text(order.customerName, 15, yPos);

  if (order.customerEmail) {
    yPos += 5;
    doc.text(`Email: ${order.customerEmail}`, 15, yPos);
  }

  if (order.customerPhone) {
    yPos += 5;
    doc.text(`Telefone: ${order.customerPhone}`, 15, yPos);
  }

  // Informações do Pedido
  const rightColX = 120;
  let rightYPos = 50;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Informações do Pedido", rightColX, rightYPos);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  rightYPos += 7;
  doc.text(
    `Data: ${new Date(order.orderDate).toLocaleDateString("pt-BR")}`,
    rightColX,
    rightYPos
  );

  if (order.dueDate) {
    rightYPos += 5;
    doc.text(
      `Vencimento: ${new Date(order.dueDate).toLocaleDateString("pt-BR")}`,
      rightColX,
      rightYPos
    );
  }

  rightYPos += 5;
  doc.text(`Status: ${statusLabels[order.status] || order.status}`, rightColX, rightYPos);

  rightYPos += 5;
  doc.text(
    `Pagamento: ${paymentStatusLabels[order.paymentStatus] || order.paymentStatus}`,
    rightColX,
    rightYPos
  );

  // Tabela de Itens
  yPos = Math.max(yPos, rightYPos) + 15;

  const tableData = order.items.map((item) => [
    item.productName,
    item.quantity.toString(),
    `R$ ${item.unitPrice.toFixed(2)}`,
    `R$ ${item.total.toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [["Produto", "Qtd", "Preço Unit.", "Total"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: "bold",
    },
    bodyStyles: {
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { cellWidth: 20, halign: "center" },
      2: { cellWidth: 35, halign: "right" },
      3: { cellWidth: 35, halign: "right" },
    },
  });

  // Totais
  const finalY = (doc as any).lastAutoTable.finalY || yPos + 40;
  yPos = finalY + 10;

  const totalsX = 140;

  doc.setFontSize(10);
  doc.text("Subtotal:", totalsX, yPos);
  doc.text(`R$ ${order.subtotal.toFixed(2)}`, 185, yPos, { align: "right" });

  yPos += 6;
  doc.text("Desconto:", totalsX, yPos);
  doc.text(`R$ ${order.discount.toFixed(2)}`, 185, yPos, { align: "right" });

  yPos += 8;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Total:", totalsX, yPos);
  doc.text(`R$ ${order.total.toFixed(2)}`, 185, yPos, { align: "right" });

  // Observações
  if (order.notes) {
    yPos += 15;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Observações:", 15, yPos);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    yPos += 6;

    const splitNotes = doc.splitTextToSize(order.notes, 180);
    doc.text(splitNotes, 15, yPos);
  }

  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(8);
  doc.setTextColor(...secondaryColor);
  doc.text(
    `Gerado em ${new Date().toLocaleString("pt-BR")}`,
    15,
    pageHeight - 10
  );
  doc.text("Orion ERP", 195, pageHeight - 10, { align: "right" });

  // Salvar
  doc.save(`Pedido_${order.orderNumber}.pdf`);
}
