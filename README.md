# 📒 Guju Khata - Personal Financial Ledger

Keep track of all your financials, from investments, real estate, commodities, fixed income, debts, bills, income, etc. The more information you provide, the more holistic the output in the home page. All data is saved through the browser (like cookieclicker).

## Features

- 💰 Track income and expenses across multiple categories
- 📊 Real-time financial summary with total income, expenses, and net balance
- 💾 Automatic data persistence using browser localStorage
- 📱 Responsive design that works on desktop and mobile
- 🎨 Clean, intuitive user interface
- 🔒 All data stored locally in your browser - complete privacy

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/FreshFold-ai/guju.khata.git
   cd guju.khata
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Usage

1. **Add a Transaction**: Click the "+ Add Transaction" button to record income or expenses
2. **Choose Category**: Select from predefined categories like Salary, Investment, Bills, etc.
3. **Track Your Finances**: View your total income, expenses, and net balance at a glance
4. **Data Persistence**: Your data is automatically saved to your browser's localStorage
5. **Return Anytime**: Close and reopen the app - your data will still be there!

## Technology Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: CSS3
- **Data Persistence**: Browser localStorage API

## Data Persistence

All financial data is stored locally in your browser using the localStorage API. This means:

- ✅ Your data never leaves your device
- ✅ Complete privacy - no server storage
- ✅ Works offline after initial load
- ⚠️ Data is tied to your browser - clearing browser data will delete your records
- ⚠️ Data won't sync across different browsers or devices

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC
