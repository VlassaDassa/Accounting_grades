from django.db import models



# Специальность
class Specialization(models.Model):
    name = models.CharField(max_length=30)

    def __str__(self):
        return str(self.name)


# Группа
class Group(models.Model):
    group_name = models.CharField(max_length=30)
    specialization = models.ForeignKey(Specialization, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.group_name)


# Студент
class Student(models.Model):
    fullname = models.CharField(max_length=50)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.fullname) + ' | ' + str(self.group.group_name)


# Период (месяц, семестр, год и т.п)
class Period(models.Model):
    period = models.CharField(max_length=50)

    def __str__(self):
        return str(self.period)
    

# Предметы
class Subject(models.Model):
    subject_name = models.CharField(max_length=70)
    specialization = models.ForeignKey(Specialization, on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return str(self.subject_name)
    

# Оценки
class Grades(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    period = models.ForeignKey(Period, on_delete=models.CASCADE)
    grades = models.JSONField(blank=True, null=True)

    date = models.DateField(auto_now=True)

    def __str__(self):
        return f'{self.student} | {self.period}'

    

# Староста
class Manager(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    login = models.CharField(max_length=30)
    password = models.CharField(max_length=50)

    def __str__(self):
        return str(self.student.fullname) + ' | ' + str(self.group.group_name)


