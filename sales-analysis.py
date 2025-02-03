import pandas as pd
import numpy as np
from datetime import datetime

def load_excel_data(file_path):
    # Dictionary to store DataFrames from each sheet
    dfs = {}
    
    # Read all sheets
    excel_file = pd.ExcelFile(file_path)
    
    # Load relevant sheets
    sheets_to_load = [
        'Data',
        'Sales Trend Over Time',
        'Top-Selling Categories & Brands',
        'Sales Person Performance',
        'Product Demand Trends',
        'Sales by Region (State & City)',
        'Kpis'
    ]
    
    for sheet in sheets_to_load:
        try:
            dfs[sheet] = pd.read_excel(excel_file, sheet_name=sheet)
        except:
            print(f"Warning: Could not load sheet {sheet}")
    
    return dfs

def calculate_kpis(data_df):
    kpis = {}
    
    # Total sales revenue
    kpis['total_sales_revenue'] = data_df['Total Sales Amount'].sum()
    
    # Sales growth
    sales_by_month = data_df.groupby(data_df['Order Date'].dt.to_period('M'))['Total Sales Amount'].sum()
    kpis['sales_growth_pct'] = ((sales_by_month.iloc[-1] - sales_by_month.iloc[0]) / sales_by_month.iloc[0] * 100)
    
    # Total order count
    kpis['total_order_count'] = data_df['Order ID'].nunique()
    
    # Average order volume
    kpis['avg_order_volume'] = data_df.groupby('Order ID')['Quantity'].sum().mean()
    
    return pd.Series(kpis)

def analyze_sales_person_performance(data_df):
    sales_person_metrics = data_df.groupby('Sales Person')[
        ['Total Sales Amount', 'Quantity']
    ].agg({
        'Total Sales Amount': 'sum',
        'Quantity': 'sum'
    }).round(2)
    
    sales_person_metrics['Average Order Value'] = (
        data_df.groupby(['Sales Person', 'Order ID'])['Total Sales Amount']
        .sum()
        .groupby('Sales Person')
        .mean()
    ).round(2)
    
    return sales_person_metrics.sort_values('Total Sales Amount', ascending=False)

def analyze_regional_sales(data_df):
    regional_sales = data_df.groupby(['State', 'City'])[
        ['Total Sales Amount', 'Quantity']
    ].agg({
        'Total Sales Amount': 'sum',
        'Quantity': 'sum'
    }).round(2)
    
    return regional_sales.sort_values('Total Sales Amount', ascending=False)

def analyze_product_trends(data_df):
    product_trends = data_df.groupby(['Category', 'Brand', 'Product'])[
        ['Total Sales Amount', 'Quantity']
    ].agg({
        'Total Sales Amount': 'sum',
        'Quantity': 'sum'
    }).round(2)
    
    return product_trends.sort_values('Total Sales Amount', ascending=False)

def analyze_sales_trends(data_df):
    sales_trends = data_df.set_index('Order Date').resample('M')[
        ['Total Sales Amount', 'Quantity']
    ].agg({
        'Total Sales Amount': 'sum',
        'Quantity': 'sum'
    })
    
    sales_trends['Monthly Growth'] = sales_trends['Total Sales Amount'].pct_change() * 100
    return sales_trends.round(2)

def generate_analysis_report(file_path, output_path):
    # Load data
    dfs = load_excel_data(file_path)
    main_data = dfs['Data']
    
    # Convert Order Date to datetime
    main_data['Order Date'] = pd.to_datetime(main_data['Order Date'])
    
    # Calculate all metrics
    kpis = calculate_kpis(main_data)
    sales_person_performance = analyze_sales_person_performance(main_data)
    regional_sales = analyze_regional_sales(main_data)
    product_trends = analyze_product_trends(main_data)
    sales_trends = analyze_sales_trends(main_data)
    
    # Create dictionary of DataFrames to save
    results = {
        'KPIs': pd.DataFrame(kpis).T,
        'Sales_Person_Performance': sales_person_performance,
        'Regional_Sales': regional_sales,
        'Product_Trends': product_trends,
        'Sales_Trends': sales_trends
    }
    
    # Save each analysis to separate CSV files
    for name, df in results.items():
        df.to_csv(f"{output_path}/{name}.csv")
    
    return results

# Usage
if __name__ == "__main__":
    file_path = "Sales Performance Report of product.xlsx"
    output_path = "./analysis_results"
    
    results = generate_analysis_report(file_path, output_path)
    
    # Print summary insights
    print("\nKey Insights:")
    print(f"Total Sales Revenue: ${results['KPIs'].loc['total_sales_revenue'].values[0]:,.2f}")
    print(f"Sales Growth: {results['KPIs'].loc['sales_growth_pct'].values[0]:.1f}%")
    print(f"Total Orders: {results['KPIs'].loc['total_order_count'].values[0]:,.0f}")
    print(f"Average Order Volume: {results['KPIs'].loc['avg_order_volume'].values[0]:.1f} units")
    
    print("\nTop Performing Sales Person:")
    print(results['Sales_Person_Performance'].head(1))
    
    print("\nTop Performing Region:")
    print(results['Regional_Sales'].head(1))
    
    print("\nTop Selling Product Category:")
    print(results['Product_Trends'].groupby('Category')['Total Sales Amount'].sum().sort_values(ascending=False).head(1))
