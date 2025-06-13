export enum EmailType {
  WELCOME = 'welcome',
  PURCHASE = 'purchase',
  AUCTION_WIN = 'auction_win',
  AUCTION_OUTBID = 'auction_outbid',
  CONTRACT_AVAILABLE = 'contract_available',
  CONTRACT_ACCEPTED = 'contract_accepted',
  BALANCE_TOPUP = 'balance_topup',
  PASSWORD_RESET = 'password_reset',
  ACCOUNT_LOCKED = 'account_locked',
  SYSTEM_NOTIFICATION = 'system_notification',
}

export interface EmailData {
  to: string;
  subject: string;
  type: EmailType;
  data: Record<string, any>;
}

export interface WelcomeEmailData {
  firstName: string;
  lastName: string;
  innl: string;
  className: string;
  cottageName: string;
  loginUrl: string;
}

export interface PurchaseEmailData {
  firstName: string;
  productName: string;
  quantity: number;
  totalAmount: number;
  remainingBalance: number;
  purchaseDate: string;
}

export interface AuctionWinEmailData {
  firstName: string;
  auctionTitle: string;
  winningBid: number;
  paymentAmount: number;
  auctionEndDate: string;
}

export interface AuctionOutbidEmailData {
  firstName: string;
  auctionTitle: string;
  yourBid: number;
  currentBid: number;
  auctionEndDate: string;
  auctionUrl: string;
}

export interface ContractEmailData {
  firstName: string;
  contractTitle: string;
  rewardAmount: number;
  deadline?: string;
  requirements: string;
  contractUrl: string;
}

export interface BalanceTopupEmailData {
  firstName: string;
  amount: number;
  newBalance: number;
  reason: string;
  date: string;
}

export interface PasswordResetEmailData {
  firstName: string;
  resetUrl: string;
  expiresIn: string;
}

export interface SystemNotificationEmailData {
  firstName: string;
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
}

export interface EmailTemplate {
  subject: string;
  template: string;
}

export interface EmailConfig {
  smtp: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  from: {
    name: string;
    address: string;
  };
  rateLimit: {
    maxPerHour: number;
    maxPerDay: number;
  };
} 