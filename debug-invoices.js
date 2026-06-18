require('dotenv').config();
const mongoose = require('mongoose');
const invoice = require('./modals').invoice;

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  const docs = await invoice.find({}).select('invoiceNumber userId').lean();
  console.log('Total invoices:', docs.length);
  docs.forEach((d) => {
    console.log(JSON.stringify({
      invoiceNumber: d.invoiceNumber,
      userId: String(d.userId),
      userIdType: typeof d.userId,
      userIdConstructor: d.userId?.constructor?.name
    }));
  });

  const byUser = {};
  docs.forEach((d) => {
    const uid = String(d.userId);
    if (!byUser[uid]) byUser[uid] = [];
    byUser[uid].push(d.invoiceNumber);
  });
  console.log('\nBy user:');
  for (const [uid, nums] of Object.entries(byUser)) {
    const numericMax = Math.max(...nums.map((n) => Number(n) || 0));
    console.log('User', uid, 'numbers:', nums, 'next should be:', numericMax + 1);
  }

  if (docs.length > 0) {
    const testUserId = String(docs[0].userId);
    const [latest] = await invoice.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(testUserId) } },
      {
        $addFields: {
          invoiceNumberNumeric: {
            $convert: { input: '$invoiceNumber', to: 'int', onError: 0, onNull: 0 }
          }
        }
      },
      { $sort: { invoiceNumberNumeric: -1 } },
      { $limit: 1 },
      { $project: { invoiceNumber: 1, invoiceNumberNumeric: 1 } }
    ]);
    console.log('\nAggregation result for first user:', latest);
  }

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
