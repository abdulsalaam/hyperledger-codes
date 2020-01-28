
/*
* Sample transcation processor function
* @param {org.altiux.hrms.FundTransferByManager} ft
* @transaction
*/
async function  FundTransferByManager(ft)
{
    let WalletRegistry = await getAssetRegistry('org.altiux.hrms.Wallet');
    let ManagerRegistry = await getParticipantRegistry('org.altiux.hrms.Manager');
    let FundRegistry = await getAssetRegistry('org.altiux.hrms.Funds');
    let WalletIdExist = await WalletRegistry.exists(ft.manager.wallet.walletId);
    let ManagerIdExist = await ManagerRegistry.exists(ft.manager.managerId);
    if(WalletIdExist && ManagerIdExist){
        if(ft.manager.wallet.balance > ft.amount){
            ft.fund.balance += ft.amount
            ft.manager.wallet.balance -=ft.amount
            
            await WalletRegistry.update(ft.manager.wallet);  
            await FundRegistry.update(ft.fund);
        }
        else{
        throw new Error("Insufficient balance in managers account")
        }
    }
    else{
        throw new Error('Either Wallet Or Manager Doesnot Exist');
    }   
}
/*
* Sample transcation processor function
* @param {org.altiux.hrms.FundTransferByCustomer} ftc
* @transaction
*/

async function  FundTransferByCustomer(ftc)
{
    let WalletRegistry = await getAssetRegistry('org.altiux.hrms.Wallet');
    let CustomerRegistry = await getParticipantRegistry('org.altiux.hrms.Customer');
    let FundRegistry = await getAssetRegistry('org.altiux.hrms.Funds');
    let WalletIdExist = await WalletRegistry.exists(ftc.customer.wallet.walletId);
    let CustomerIdExist = await CustomerRegistry.exists(ftc.customer.customerId);
    if(WalletIdExist && CustomerIdExist){
        if(ftc.customer.wallet.balance > ftc.amount){
            ftc.fund.balance += ftc.amount
            ftc.customer.wallet.balance -=ftc.amount
            
            await WalletRegistry.update(ftc.customer.wallet);  
            await FundRegistry.update(ftc.fund);
        }
        else{
        throw new Error("Insufficient balance in customers account")
        }
    }
    else{
        throw new Error('Either Wallet Or Customer Doesnot Exist');
    }   
}

/*
* Sample transcation processor function
* @param {org.altiux.hrms.EmployeeSalary} es
* @transaction
*/

function EmployeeSalary(es)
{
    if(es.employee.salaryStatus == "UNPAID")
    {
        if(es.fund.balance > es.employee.salary)
        {
            es.fund.balance -= es.employee.salary
            es.employee.wallet.balance += es.employee.salary
            
            es.employee.salaryStatus = "PAID"

            return getAssetRegistry('org.altiux.hrms.Funds')
            .then(function(accRegistry){
                return accRegistry.update(es.fund);
            }).then(function(){
                return getAssetRegistry('org.altiux.hrms.Wallet');
            }).then(function(accRegistry){
                return accRegistry.update(es.employee.wallet);
            }).then(function(){
                return getParticipantRegistry('org.altiux.hrms.Employee');
            }).then(function(participantRegistry){
                return participantRegistry.update(es.employee);
            });
        }
        else{
            throw new Error("Fund Balance insufficient")
        }
        
    }
    else{
        throw new Error("You are already paid")
    }
}

