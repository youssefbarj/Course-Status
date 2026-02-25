#!/usr/bin/env python3
"""
Update course statuses to Feedback Complete for courses 2-10 in first-rollout section.
"""

import json
import sys
from datetime import datetime

def update_course_statuses():
    # Load the courses.json file
    try:
        with open('courses.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("Error: courses.json not found")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in courses.json: {e}")
        sys.exit(1)

    # Track changes
    changed_courses = []

    # Iterate through sections
    for section in data.get('sections', []):
        if section.get('id') == 'first-rollout':
            # Found the first-rollout section
            for course in section.get('courses', []):
                course_number = course.get('number', '')
                # Extract numeric part from "Course X"
                if course_number.startswith('Course '):
                    try:
                        num = int(course_number.replace('Course ', '').strip())
                        if 2 <= num <= 10:
                            old_status = course.get('status', '')
                            if old_status == 'Feedback Phase':
                                course['status'] = 'Feedback Complete'
                                changed_courses.append({
                                    'number': course_number,
                                    'title': course.get('title', ''),
                                    'old_status': old_status,
                                    'new_status': 'Feedback Complete'
                                })
                            elif old_status == 'Feedback Complete':
                                print(f"Note: {course_number} ({course.get('title', '')}) already has status 'Feedback Complete'")
                            else:
                                print(f"Warning: {course_number} ({course.get('title', '')}) has unexpected status '{old_status}', not changing")
                    except ValueError:
                        # Not a numeric course number, skip
                        continue

    # Update lastUpdated timestamp
    data['lastUpdated'] = datetime.now().isoformat()

    # Save the updated data
    try:
        with open('courses.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Error saving courses.json: {e}")
        sys.exit(1)

    # Print summary
    print(f"Updated {len(changed_courses)} courses to 'Feedback Complete':")
    for course in changed_courses:
        print(f"  - {course['number']}: {course['title']} ({course['old_status']} -> {course['new_status']})")

    print(f"\nUpdated courses.json with new timestamp: {data['lastUpdated']}")

if __name__ == '__main__':
    update_course_statuses()