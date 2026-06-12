async function listInvoices() {
  const { db } = await import('@vercel/postgres');
  const client = await db.connect();
  const data = await client.sql`
    SELECT invoices.amount, customers.name
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE invoices.amount = 666;
  `;

  return data.rows;
}

export async function GET() {
  if (!process.env.POSTGRES_URL) {
    return Response.json({
      message: 'POSTGRES_URL is not configured.',
      rows: [],
    });
  }

  try {
    return Response.json(await listInvoices());
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
