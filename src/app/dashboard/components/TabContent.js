'use client';

import TabQueue from './TabQueue';
import TabMenu from './TabMenu';
import TabTables from './TabTables';
import TabReports from './TabReports';
import TabSettings from './TabSettings';

export default function TabContent({
  activeTab, theme, d, rp, displayOrders, queueFilter, setQueueFilter,
  menuSearch, setMenuSearch, menuCategoryFilter, setMenuCategoryFilter,
  newTableNum, setNewTableNum, openAddMenu, openEditMenu, onAddTable,
  onDownloadQR, onPrintBill, reportMode, setReportMode, reportDateStr, setReportDateStr,
  reportMonth, setReportMonth, reportYear, setReportYear, reportStartDateStr, setReportStartDateStr,
  reportEndDateStr, setReportEndDateStr, reportLabel, reportStats, topMenus, chartData,
  maxChartRev, totalChartRev, activeDays, handleExportCSV, handlePrintReport,
  handleUploadImage, uploadingLogo, uploadingBanner, onSaveSettings,
}) {
  if (activeTab === 'queue') {
    return <TabQueue theme={theme} displayOrders={displayOrders} queueFilter={queueFilter} setQueueFilter={setQueueFilter} nowTick={d.nowTick} rp={rp} onUpdateOrderStatus={d.handleUpdateOrderStatus} onCancelOrder={d.handleCancelOrder} onPrintBill={onPrintBill} />;
  }

  if (activeTab === 'menu') {
    return <TabMenu theme={theme} menus={d.menus} menuSearch={menuSearch} setMenuSearch={setMenuSearch} menuCategoryFilter={menuCategoryFilter} setMenuCategoryFilter={setMenuCategoryFilter} onAddMenu={openAddMenu} onEditMenu={openEditMenu} onDeleteMenu={d.handleDeleteMenu} onToggleStatus={d.toggleMenuStatus} rp={rp} />;
  }

  if (activeTab === 'tables') {
    return <TabTables theme={theme} tables={d.tables} newTableNum={newTableNum} setNewTableNum={setNewTableNum} onAddTable={onAddTable} onDeleteTable={d.handleDeleteTable} onDownloadQR={onDownloadQR} />;
  }

  if (activeTab === 'reports') {
    return <TabReports theme={theme} reportMode={reportMode} setReportMode={setReportMode} reportDateStr={reportDateStr} setReportDateStr={setReportDateStr} reportMonth={reportMonth} setReportMonth={setReportMonth} reportYear={reportYear} setReportYear={setReportYear} reportStartDateStr={reportStartDateStr} setReportStartDateStr={setReportStartDateStr} reportEndDateStr={reportEndDateStr} setReportEndDateStr={setReportEndDateStr} reportLabel={reportLabel} reportStats={reportStats} topMenus={topMenus} chartData={chartData} maxChartRev={maxChartRev} totalChartRev={totalChartRev} showDailyBreakdown={false} activeDays={activeDays} onExportCSV={handleExportCSV} onPrintReport={handlePrintReport} rp={rp} />;
  }

  if (activeTab === 'settings') {
    return <TabSettings theme={theme} settings={d.settings} setSettings={d.setSettings} onSave={onSaveSettings} onUploadImage={handleUploadImage} uploadingLogo={uploadingLogo} uploadingBanner={uploadingBanner} />;
  }

  return null;
}