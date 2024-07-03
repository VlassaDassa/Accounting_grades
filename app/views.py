import json
from django.shortcuts import render
from django.http import JsonResponse
from django.core.serializers import serialize
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.contrib.auth import authenticate

from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import Paragraph
from collections import defaultdict
from reportlab.platypus import Spacer
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table
from reportlab.platypus.flowables import Flowable
from tempfile import NamedTemporaryFile
from django.http import HttpResponse
import os

from .models import Group, Student, Period, Manager, Subject, Grades, Specialization


# Отрисовка страницы "Главная"
def index(request):
    return render(request, 'index.html')


# Отрисовка страницы "Администратор"
def admin_page(request):
    return render(request, 'admin.html')


# Отрисовка страницы "Староста"
def manager_panel(request):
    return render(request, 'manager.html')


# Авторизация
@csrf_exempt
def login_view(request):
    login = request.POST.get('login')
    password = request.POST.get('password')
    
    user = authenticate(username=login, password=password)
    if user:
        return JsonResponse({'success': True, 'admin': True})

    custom_user = Manager.objects.filter(login=login, password=password).first()
    if custom_user:
        return JsonResponse({'success': True, 'admin': False, 'login': custom_user.login})
    
    return JsonResponse({'success': False})



# Получение данных для таблицы "Группы"
def get_groups(request):
    groups = Group.objects.all()
    groups_data = []

    for group in groups:
        group_data = {
            'id': group.pk,
            'group_name': group.group_name,
            'specialization': {
                'specialization_name': group.specialization.name if group.specialization else None,
                'specialization_id': group.specialization.pk if group.specialization else None,
            }
        }
        groups_data.append(group_data)

    return JsonResponse({'groups': groups_data}, safe=False)

# Удаление группы
def remove_group(request, id):
    group = Group.objects.get(id=id)
    group.delete()
    return JsonResponse({'success': True})

# Добавление группы
@csrf_exempt
def add_group(request):
    group_name = request.POST.get('group_name')
    specialization_id = request.POST.get('specialization_id')
    new_group = Group(group_name=group_name, specialization=Specialization.objects.get(pk=specialization_id))
    new_group.save()
    return JsonResponse({'success': True, 'new_group_id': new_group.pk})

# Обновление группы
@csrf_exempt
def update_group(request):
    group_id = request.POST.get('id')
    new_value = request.POST.get('new_value')
    specialization_id = request.POST.get('specialization_id')

    try:
        specialization = Specialization.objects.get(id=specialization_id)
    except Exception as _ex:
        specialization = None

    group = Group.objects.get(id=group_id)
    group.group_name = new_value
    group.specialization = specialization
    group.save()

    return JsonResponse({'success': True})


# Получение группы по имени студента
def get_group_for_student_name(request, student_name):
    try:
        student = Student.objects.get(fullname=student_name)
    except:
        return JsonResponse({'group_id': '', 'group_name':''})
    else:
        return JsonResponse({'group_id': str(student.group.id), 'group_name': str(student.group.group_name)})

    





# Получение данных для таблицы "Специальности"
def get_specializations(request):
    data = serialize('json', Specialization.objects.all())
    return JsonResponse({'specializations': data})

# Добавление специальности
@csrf_exempt
def add_specializations(request):
    name = request.POST.get('name')
    new_specializations = Specialization(name=name)
    new_specializations.save()
    return JsonResponse({'success': True, 'new_specialization_id': new_specializations.pk})

# Обновление специальности
@csrf_exempt
def update_specializations(request):
    specialization_id = request.POST.get('id')
    new_value = request.POST.get('new_value')
    specialization = Specialization.objects.get(id=specialization_id)
    specialization.name = new_value
    specialization.save()

    return JsonResponse({'success': True})

# Удаление специальностей
def remove_specialization(request, id):
    specialization = Specialization.objects.get(id=id)
    specialization.delete()
    return JsonResponse({'success': True})


# Получение данных для таблицы "Предметы"
def get_subjects(request):
    subjects = Subject.objects.all()
    subjects_data = []

    for subject in subjects:
        subject_data = {
            'id': subject.pk,
            'subject_name': subject.subject_name,
            'specialization': {
                'specialization_name': subject.specialization.name if subject.specialization else None,
                'specialization_id': subject.specialization.pk if subject.specialization else None,
            }
        }
        subjects_data.append(subject_data)

    return JsonResponse({'subjects': subjects_data}, safe=False)


# Получение данных для таблицы "Предметы" по специальности
def get_subjects_for_specialization(request, group_id):
    if group_id == "undefined":
        subjects = Subject.objects.filter(specialization=None)
    else:
        subjects = Subject.objects.filter(specialization=Specialization.objects.get(id=group_id))

    subjects_data = []

    for subject in subjects:
        subject_data = {
            'id': subject.pk,
            'subject_name': subject.subject_name,
            'group': {
                'group_name': subject.specialization.name if subject.specialization else None,
                'group_id': subject.specialization.name if subject.specialization else None,
            }
        }
        subjects_data.append(subject_data)

    return JsonResponse({'subjects': subjects_data}, safe=False)


# Получение данных для таблицы "Предметы" по группе
def get_subjects_for_group(request, group_id):
    if group_id == "undefined":
        subjects = Subject.objects.filter(specialization=None)
    else:
        group_specialization = Group.objects.get(id=group_id).specialization
        subjects = Subject.objects.filter(specialization=group_specialization) | Subject.objects.filter(specialization=None)

    subjects_data = []
    for subject in subjects:
        subject_data = {
            'id': subject.pk,
            'subject_name': subject.subject_name,
            'group': {
                'group_name': subject.specialization.name if subject.specialization else None,
                'group_id': subject.specialization.id if subject.specialization else None,
            }
        }
        subjects_data.append(subject_data)

    return JsonResponse({'subjects': subjects_data}, safe=False)


# Удаление предмета
def remove_subject(request, id):
    subject = Subject.objects.get(id=id)
    subject.delete()
    return JsonResponse({'success': True})

# Добавление предмета
@csrf_exempt
def add_subject(request):
    subject_name = request.POST.get('subject_name')
    new_subject = Subject(subject_name=subject_name)
    new_subject.save()
    return JsonResponse({'success': True, 'new_subject_id': new_subject.pk})

# Обновление предмета
@csrf_exempt
def update_subject(request):
    subject_id = request.POST.get('id')
    new_value = request.POST.get('new_value')
    specialization_id = request.POST.get('specialization_id')

    try:
        specialization=Specialization.objects.get(id=specialization_id)
    except Exception as _ex:
        specialization = None

    subject = Subject.objects.get(id=subject_id)
    subject.subject_name = new_value
    subject.specialization = specialization
    subject.save()

    return JsonResponse({'success': True})





# Получение данных для таблицы "Студенты"
def get_students(request):
    students = Student.objects.all()
    students_data = []
    for student in students:
        student_data = {
            'student': {
                'fullname': student.fullname,
                'id': student.id,
            },
            'group': {
                'group_name':  student.group.group_name,
                'id':  student.group.id,

            }
        }
        students_data.append(student_data)

    return JsonResponse({'students': students_data})


# Получение данных для таблицы "Студенты". Фильтр по группу
def get_students_for_group(request, group_id):
    students = Student.objects.filter(group=Group.objects.get(id=group_id))
    students_data = []
    for student in students:
        student_data = {
            'student': {
                'fullname': student.fullname,
                'id': student.id,
            },
            'group': {
                'group_name':  student.group.group_name,
                'id':  student.group.id,

            }
        }
        students_data.append(student_data)

    return JsonResponse({'students': students_data})


# Получение данных для таблицы "Студенты". Фильтр по имени группы
def get_students_for_group_name(request, group_name):
    students = Student.objects.filter(group=Group.objects.get(group_name=group_name))
    students_data = []
    for student in students:
        student_data = {
            'student': {
                'fullname': student.fullname,
                'id': student.id,
            },
            'group': {
                'group_name':  student.group.group_name,
                'id':  student.group.id,

            }
        }
        students_data.append(student_data)

    return JsonResponse({'students': students_data})


# Удаление студента
def remove_student(request, id):
    student = Student.objects.get(id=id)
    student.delete()
    return JsonResponse({'success': True})

# Добавление студента
@csrf_exempt
def add_student(request):
    fullname = request.POST.get('fullname')
    group_id = request.POST.get('group_id')
    group = Group.objects.get(id=group_id)
    new_student = Student(fullname=fullname, group=group)
    new_student.save()
    return JsonResponse({'success': True, 'new_student_id': new_student.pk})

# Обновление студента
@csrf_exempt
def update_student(request):
    student_id = request.POST.get('student_id')
    fullname = request.POST.get('fullname')
    group_id = request.POST.get('group_id')
    group = Group.objects.get(id=group_id)
    
    student = Student.objects.get(id=student_id)
    student.fullname = fullname
    student.group = group
    student.save()

    return JsonResponse({'success': True})





# Получение данных для таблицы "Периоды"
def get_periods(request):
    data = serialize('json', Period.objects.all())
    return JsonResponse({'periods': data})

# Удаление периода
def remove_period(request, id):
    period = Period.objects.get(id=id)
    period.delete()
    return JsonResponse({'success': True})

# Добавление периода
@csrf_exempt
def add_period(request):
    period_name = request.POST.get('period')
    period = Period(period=period_name)
    period.save()
    return JsonResponse({'success': True, 'new_period_id': period.pk})

# Обновление периода
@csrf_exempt
def update_period(request):
    period_id = request.POST.get('id')
    new_value = request.POST.get('new_value')
    period = Period.objects.get(id=period_id)
    period.period = new_value
    period.save()

    return JsonResponse({'success': True})





# Получение данных для таблицы "Старосты"
def get_managers(request):
    managers = Manager.objects.all()
    managers_data = []
    for manager in managers:
        manager_data = {
            'manager_id': manager.id,
            'login': manager.login,
            'password': manager.password,
            'student': {
                'fullname': manager.student.fullname,
                'id': manager.student.id,
            },
            'group': {
                'group_name':  manager.group.group_name,
                'id':  manager.group.id,

            }
        }
        managers_data.append(manager_data)

    return JsonResponse({'managers': managers_data})

# Удаление менеджера
def remove_manager(request, id):
    manager = Manager.objects.get(id=id)
    manager.delete()
    return JsonResponse({'success': True})

# Добавление менеджера
@csrf_exempt
def add_manager(request):
    student_id = request.POST.get('student_id')
    group_id = request.POST.get('group_id')
    login = request.POST.get('login')
    password = request.POST.get('password')

    manager = Manager(
        student=Student.objects.get(id=student_id),
        group=Group.objects.get(id=group_id),
        login=login,
        password=password
    )
    manager.save()
    return JsonResponse({'success': True, 'new_manager_id': manager.pk})

# Обновление менеджера
@csrf_exempt
def update_manager(request):
    manager_id = request.POST.get('manager_id')
    student_id = request.POST.get('student_id')
    group_id = request.POST.get('group_id')
    login = request.POST.get('login')
    password = request.POST.get('password')

    manager = Manager.objects.get(id=manager_id)
    manager.student = Student.objects.get(id=student_id)
    manager.group = Group.objects.get(id=group_id)
    manager.login = login
    manager.password = password
    manager.save()

    return JsonResponse({'success': True})





# Получение данных для таблицы "Оценки"
def get_grades(request):
    grades = Grades.objects.all()
    grades_data = []
    for grade in grades:
        grade_data = {
            'grade_id': grade.pk,
            'student': {
                'fullname': grade.student.fullname,
                'id': grade.student.pk,
            },
            'period': {
                'period': grade.period.period,
                'id': grade.period.pk,
            },
            'grades': grade.grades,
        }
        grades_data.append(grade_data)

    return JsonResponse({'grades': grades_data})


def get_grades_for_group(request, group_id, period_id):
    grades = Grades.objects.filter(student__group_id=group_id, period_id=period_id)
    grades_data = []
    for grade in grades:
        grade_data = {
            'grade_id': grade.pk,
            'student': {
                'fullname': grade.student.fullname,
                'id': grade.student.pk,
            },
            'period': {
                'period': grade.period.period,
                'id': grade.period.pk,
            },
            'grades': grade.grades,
        }
        grades_data.append(grade_data)

    return JsonResponse({'grades': grades_data})

# Удаление записи об оценках
def remove_grade(request, subject_name, period_id, group_id):
    new_grades = []

    period = Period.objects.get(id=period_id)
    group = Group.objects.get(id=group_id)

    students = Student.objects.filter(group=group)
    # Очистка
    grades = Grades.objects.filter(student__in=students, period=period)
    for i in grades[0].grades:
        if subject_name != i['subject_name']:
            new_grades.append(i)

    Grades.objects.filter(student__in=students, period=period).update(grades=new_grades)
    return JsonResponse({'success': True})


# Добавление записи об оценках
@csrf_exempt
def add_grade(request):
    student_id = request.POST.get('student_id')
    period_id = request.POST.get('period_id')
    try:
        grades = json.loads(request.POST.get('grades'))
    except:
        grades = request.POST.get('grades')

    subject = Grades(
        student=Student.objects.get(id=student_id),
        period=Period.objects.get(id=period_id),
        grades=grades,
    )
    subject.save()
    return JsonResponse({'success': True, 'new_grade_id': subject.pk})

# Обновление записи об оценках
@csrf_exempt
def update_grade(request):
    grade_id = request.POST.get('grade_id')
    student_id = request.POST.get('student_id')
    period_id = request.POST.get('period_id')
    grades = json.loads(request.POST.get('grades'))

    grade = Grades.objects.get(id=grade_id)
    grade.student = Student.objects.get(id=student_id)
    grade.period = Period.objects.get(id=period_id)
    grade.grades = grades
    grade.save()

    return JsonResponse({'success': True})


# Обновление записи об оценках по группе и периоду
@csrf_exempt
def update_grades_for_group(request):
    period_id = request.POST.get('period_id')
    group_id = request.POST.get('group_id')
    new_grades = json.loads(request.POST.get('newGrades'))

    # Получаем соответствующие объекты Period и Group
    period = Period.objects.get(id=period_id)
    group = Group.objects.get(id=group_id)

    # Получаем всех студентов в этой группе
    students = Student.objects.filter(group=group)

    # Обновляем все записи Grades для этих студентов в указанном периоде
    Grades.objects.filter(student__in=students, period=period).update(grades=new_grades)
    
    return JsonResponse({'success': True})



# Запрос в БД 
def get_grades_by_group_name(group_name, period_id):
    try:
        period = Period.objects.get(id=period_id)

        if group_name == "all":
            grades = Grades.objects.filter(period=period)
        else:
            group = Group.objects.get(group_name=group_name.upper())
            students_in_group = group.student_set.all()
            grades = Grades.objects.filter(student__in=students_in_group, period=period)
    except:
        return [{
            'student': '',
            'period': '',
            'date': '',
            'grades': '',
        }]

    
    send_data = []
    for grade in grades:
        send_data.append({
            'student': grade.student.fullname,
            'period': grade.period.period,
            'date': grade.date,
            'grades': grade.grades,
        })

    return send_data


# Запрос в БД по студенту
def get_grades_by_student_id(student_id, period_id, group_name):
    try:
        period = Period.objects.get(id=period_id)

        if student_id == 'all':
            group = Group.objects.get(group_name=group_name)
            students_in_group = Student.objects.filter(group=group)
            grades = Grades.objects.filter(period=period, student__in=students_in_group)
        else:
            grades = Grades.objects.filter(student=Student.objects.get(id=student_id), period=period)

    except:
        return [{
            'student': '',
            'period': '',
            'date': '',
            'grades': '',
        }]

    
    send_data = []
    for grade in grades:
        send_data.append({
            'student': grade.student.fullname,
            'period': grade.period.period,
            'date': grade.date,
            'grades': grade.grades,
        })

    return send_data




# Получение данных для отчёта:
def get_report(request, group_name, period_id):
    try:
        send_data = get_grades_by_group_name(group_name, period_id)
    except Exception as _ex:
        print(_ex)
        return JsonResponse({'success': False})
    
    return JsonResponse({'success': True, 'grades': send_data})


# Получение данных для отчёта для одного студента
def get_report_for_student(request, student_id, period_id, group_name):
    try:
        send_data = get_grades_by_student_id(student_id, period_id, group_name)
    except Exception as _ex:
        print(_ex)
        return JsonResponse({'success': False})
    
    return JsonResponse({'success': True, 'grades': send_data})




class verticalText(Flowable):
    '''Rotates a text in a table cell.'''
    def __init__(self, text):
        Flowable.__init__(self)
        self.text = text

    def draw(self):
        canvas = self.canv
        canvas.rotate(90)
        fs = canvas._fontsize
        canvas.translate(1, -fs/1.2)  
        canvas.drawString(0, 0, self.text)

    def wrap(self, aW, aH):
        canv = self.canv
        fn, fs = canv._fontname, canv._fontsize
        return canv._leading, 1 + canv.stringWidth(self.text, fn, fs)

# Отчёт PDF
def generate_report(request, group_name, period_id, student_id):
    data = get_grades_by_student_id(student_id, period_id, group_name)
    subjects = []
    for i in data[0]['grades']:
        subjects.append(i['subject_name'])

    headers = ['№ п/п', 'Предметы\n\n\nФИО'] + [verticalText(subject) for subject in subjects]

    font_path = os.path.join(os.path.dirname(__file__), "fonts", "arial.ttf")
    font_bold_path = os.path.join(os.path.dirname(__file__), "fonts", "arial_bold.ttf")
    pdfmetrics.registerFont(TTFont('CustomFont', font_path))
    pdfmetrics.registerFont(TTFont('CustomFontBold', font_bold_path))

    rows = []
    counter = 1
    for i in data:
        fullname_paragraph = Paragraph(i['student'], ParagraphStyle('CustomParagraphStyle', fontName='CustomFont', textColor=colors.black, alignment=0))
        row = [counter, fullname_paragraph]
        for ii in i['grades']:
            grade = ii.get('grade', '-')
            row.append(grade)
        rows.append(row)
        counter += 1

    pdf_temp_file = NamedTemporaryFile(suffix='.pdf', delete=False)
    doc = SimpleDocTemplate(pdf_temp_file.name, pagesize=letter)

    title_text = "Сводная ведомость оценок студентов КЭК"

    if group_name == 'all':
        subtitle_text = f"по всем группам за {data[0]['period']}"
    else: 
        subtitle_text = f"по группе {group_name} за {data[0]['period']}"
        
    title_style = ParagraphStyle('CustomParagraphStyle', fontName='CustomFontBold', fontSize=12, textColor=colors.black, alignment=1, spaceAfter=10)
    subtitle_style = ParagraphStyle('CustomParagraphStyle', fontName='CustomFontBold', fontSize=12, textColor=colors.black, alignment=1, spaceAfter=20)
    title = Paragraph(title_text, title_style)
    subtitle = Paragraph(subtitle_text, subtitle_style)

    table_style = [
        ('BACKGROUND', (0, 0), (-1, 0), colors.white),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'CustomFontBold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]

    table_data = [headers] + rows
    table = Table(table_data)
    table.setStyle(TableStyle(table_style))

    elements = [title, subtitle, Spacer(1, 20), table]

    elements.append(Spacer(1, 50)) 

    statistics = analyze_grades(data)

    for text in statistics:
        p = Paragraph(text, ParagraphStyle('CustomParagraphStyle', fontName='CustomFontBold', fontSize=10, textColor=colors.black, leftIndent=300, spaceBefore=5))
        elements.append(p)

    doc.build(elements)

    with open(pdf_temp_file.name, 'rb') as pdf_file:
        pdf_content = pdf_file.read()

    pdf_temp_file.close()
    os.unlink(pdf_temp_file.name)

    response = HttpResponse(pdf_content, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename=report.pdf'

    return response


def analyze_grades(students):
    grade_counts = {
        "Учатся на 5": 0,
        "Учатся на 4-5": 0,
        "Учатся с одной 3": 0,
        "Неуспевающие": 0,
        "Процент успеваемости": 0
    }

    total_students = len(students)
    successful_students = 0

    for student in students:
        grades = []
        for grade in student['grades']:
            try:
                grades.append(int(grade['grade']))
            except ValueError:
                continue

        if not grades:
            continue

        if all(grade == 5 for grade in grades):
            grade_counts["Учатся на 5"] += 1
            successful_students += 1
        elif all(grade >= 4 for grade in grades):
            grade_counts["Учатся на 4-5"] += 1
            successful_students += 1
        elif grades.count(3) == 1 and all(grade >= 3 for grade in grades):
            grade_counts["Учатся с одной 3"] += 1
            successful_students += 1
        else:
            grade_counts["Неуспевающие"] += 1

    grade_counts["Процент успеваемости"] = round((successful_students / total_students) * 100, 2)

    result = [
        f"Учатся на 5 - {grade_counts['Учатся на 5']}",
        f"Учатся на 4-5 - {grade_counts['Учатся на 4-5']}",
        f"Учатся с одной 3 - {grade_counts['Учатся с одной 3']}",
        f"Неуспевающие - {grade_counts['Неуспевающие']}",
        f"Процент успеваемости - {grade_counts['Процент успеваемости']}%"
    ]
    
    return result 
