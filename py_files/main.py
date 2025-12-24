import sys
import csv
from PyQt6.QtWidgets import QMainWindow, QApplication, QFileDialog, QTableWidgetItem
from PyQt6.uic import loadUi

class MeetingSchedulerApp(QMainWindow):
    def __init__(self):
        super().__init__()
        # Load the UI file
        loadUi('schedule_app.ui', self)
        
        # Connect buttons to methods
        self.loadButton.clicked.connect(self.load_csv)
        self.swapButton.clicked.connect(self.swap_speakers)
        
        # Initialize data storage
        self.meeting_data = []
        
    def load_csv(self):
        # Open file dialog to choose CSV
        filename, _ = QFileDialog.getOpenFileName(self, 'Open CSV File', '', 'CSV Files (*.csv)')
        
        if filename:
            # Clear existing table
            self.meetingTable.clear()
            self.meetingTable.setRowCount(0)
            
            # Read CSV file
            with open(filename, 'r') as csvfile:
                csvreader = csv.reader(csvfile)
                
                # Set headers
                headers = next(csvreader)
                self.meetingTable.setColumnCount(len(headers))
                self.meetingTable.setHorizontalHeaderLabels(headers)
                
                # Populate table
                self.meeting_data = []
                for row in csvreader:
                    self.meeting_data.append(row)
                    current_row = self.meetingTable.rowCount()
                    self.meetingTable.insertRow(current_row)
                    
                    for col, value in enumerate(row):
                        self.meetingTable.setItem(current_row, col, QTableWidgetItem(value))
            
            # Update spin box ranges
            self.speaker1SpinBox.setMaximum(len(self.meeting_data))
            self.speaker2SpinBox.setMaximum(len(self.meeting_data))
    
    def swap_speakers(self):
        # Get selected rows (subtract 1 as spinbox starts from 1)
        row1 = self.speaker1SpinBox.value() - 1
        row2 = self.speaker2SpinBox.value() - 1
        
        # Ensure valid row selection
        if 0 <= row1 < len(self.meeting_data) and 0 <= row2 < len(self.meeting_data):
            # Swap speakers in data
            self.meeting_data[row1], self.meeting_data[row2] = self.meeting_data[row2], self.meeting_data[row1]
            
            # Update table display
            for col in range(len(self.meeting_data[row1])): self.meetingTable.setItem(row1, col, QTableWidgetItem(self.meeting_data[row1][col]))
            for col in range(len(self.meeting_data[row2])): self.meetingTable.setItem(row2, col, QTableWidgetItem(self.meeting_data[row2][col]))

def main():
    app = QApplication(sys.argv)
    window = MeetingSchedulerApp()
    window.show()
    sys.exit(app.exec())

if __name__ == '__main__':
    main()
